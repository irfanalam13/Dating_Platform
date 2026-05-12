from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.response import Response
from .models import User
from django.db import transaction
from django.shortcuts import get_object_or_404
from typing import cast, Dict, Any
from apps.accounts.serializers import RegisterSerializer, LoginSerializer, UserSerializer
from apps.accounts.services.auth_service import AuthService
from .utils.response import api_response
from apps.accounts.security.rate_limit import is_blocked, record_failure, reset_attempts
from drf_yasg.utils import swagger_auto_schema
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt


# -------------------------------------------------------------
# 🍪 COOKIE HELPER
# -------------------------------------------------------------
def set_auth_cookies(response, tokens):
    is_secure = not settings.DEBUG
    samesite = "Lax" if settings.DEBUG else "None"

    response.set_cookie(
        key="access",
        value=tokens["access"],
        httponly=True,
        secure=is_secure,
        samesite=samesite,
        max_age=60 * 15,
        path="/"
    )
    response.set_cookie(
        key="refresh",
        value=tokens["refresh"],
        httponly=True,
        secure=is_secure,
        samesite=samesite,
        max_age=60 * 60 * 24 * 7,
        path="/"
    )
    response.set_cookie(
        key="logged_in",
        value="true",
        httponly=False,  # Must be False so frontend JS can read it
        secure=is_secure,
        samesite=samesite,
        max_age=60 * 60 * 24 * 7,
        path="/"
    )


def clear_auth_cookies(response):
    is_secure = not settings.DEBUG
    samesite = "Lax" if settings.DEBUG else "None"

    response.set_cookie("access", "", max_age=0, path="/", httponly=True, secure=is_secure, samesite=samesite)
    response.set_cookie("refresh", "", max_age=0, path="/", httponly=True, secure=is_secure, samesite=samesite)
    response.set_cookie("logged_in", "", max_age=0, path="/", httponly=False, secure=is_secure, samesite=samesite)


# -------------------------------------------------------------
# 🔑 TOKEN HELPER
# -------------------------------------------------------------
def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }


# -------------------------------------------------------------
# 🔐 AUTH VIEWSET
# -------------------------------------------------------------
class AuthViewSet(viewsets.ViewSet):

    # 📝 REGISTER
    @action(detail=False, methods=["post"], permission_classes=[AllowAny], authentication_classes=[])
    @transaction.atomic
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return api_response(False, "Invalid data", "REGISTER_ERROR", serializer.errors, 400)

        user = serializer.save()
        token = AuthService.generate_token(user, "VERIFY_EMAIL", 1440)
        tokens = get_tokens(user)

        response = api_response(
            True,
            "Registration successful.",
            "REGISTER_SUCCESS",
            {
                "user": UserSerializer(user).data,
                "verify_token": str(token.token)
            },
            status.HTTP_201_CREATED
        )

        set_auth_cookies(response, tokens)
        return response

    # 🟢 LOGIN
    @swagger_auto_schema(request_body=LoginSerializer)
    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        authentication_classes=[]
    )
    def login(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return api_response(False, "Invalid input", "LOGIN_ERROR", serializer.errors, 400)

        data = cast(Dict[str, Any], serializer.validated_data)
        user = data["user"]
        tokens = get_tokens(user)

        response = Response({
            "success": True,
            "message": "Login successful",
            "code": "LOGIN_SUCCESS",
            "data": {
                "user": UserSerializer(user).data,
            }
        })

        set_auth_cookies(response, tokens)
        return response

    # 🔴 LOGOUT
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def logout(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response = Response({
            "success": True,
            "code": "LOGOUT_SUCCESS",
            "message": "Logged out successfully"
        }, status=200)

        clear_auth_cookies(response)
        return response

    # 📧 VERIFY EMAIL
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def verify_email(self, request):
        user = AuthService.verify_token(request.data.get("token"), "VERIFY_EMAIL")

        if not user:
            return api_response(False, "Invalid or expired token", "TOKEN_ERROR", status_code=400)

        user.is_active = True
        user.save()

        return api_response(True, "Email verified", "EMAIL_VERIFIED")

    # 🔑 FORGOT PASSWORD
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def forgot_password(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
            token = AuthService.generate_token(user, "RESET_PASSWORD", 30)

            return api_response(True, "Reset link sent", "RESET_SENT", {
                "token": str(token.token)
            })

        except User.DoesNotExist:
            return api_response(False, "User not found", "USER_NOT_FOUND", status_code=404)

    # 🔁 RESET PASSWORD
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def reset_password(self, request):
        user = AuthService.verify_token(request.data.get("token"), "RESET_PASSWORD")

        if not user:
            return api_response(False, "Invalid token", "TOKEN_ERROR", status_code=400)

        user.set_password(request.data.get("password"))
        user.save()

        return api_response(True, "Password reset successful", "PASSWORD_RESET")

    # 👤 PROFILE
    @action(
        detail=False,
        methods=["get"],
        url_path="profile/(?P<username>[^/.]+)",
        permission_classes=[IsAuthenticated]
    )
    def profile(self, request, username=None):
        user = get_object_or_404(User, username=username)
        return api_response(True, "Profile fetched", "PROFILE_SUCCESS", UserSerializer(user).data)

    # 👤 CURRENT USER (ME)
    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="me"
    )
    def me(self, request):
        user = request.user

        if not user or not user.is_authenticated:
            return api_response(False, "Unauthorized", "UNAUTHORIZED", status_code=401)

        return api_response(
            True,
            "User fetched successfully",
            "USER_SUCCESS",
            UserSerializer(user).data
        )


# -------------------------------------------------------------
# 🔄 TOKEN REFRESH VIEW
# -------------------------------------------------------------
@method_decorator(csrf_exempt, name="dispatch")
class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        refresh_cookie_name = getattr(settings, "SIMPLE_JWT", {}).get("AUTH_COOKIE_REFRESH", "refresh")
        refresh_token = request.COOKIES.get(refresh_cookie_name)

        if not refresh_token:
            return Response(
                {"success": False, "code": "NO_REFRESH_TOKEN"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            old_refresh = RefreshToken(refresh_token)

            user_id = old_refresh["user_id"]
            user = User.objects.get(id=user_id)

            try:
                old_refresh.blacklist()
            except AttributeError:
                pass

            new_refresh = RefreshToken.for_user(user)
            new_access = new_refresh.access_token

            response = Response({
                "success": True,
                "code": "TOKEN_REFRESHED"
            })

            access_lifetime = getattr(settings, "SIMPLE_JWT", {}).get("ACCESS_TOKEN_LIFETIME")
            refresh_lifetime = getattr(settings, "SIMPLE_JWT", {}).get("REFRESH_TOKEN_LIFETIME")
            access_max_age = int(access_lifetime.total_seconds()) if access_lifetime else 60 * 15
            refresh_max_age = int(refresh_lifetime.total_seconds()) if refresh_lifetime else 60 * 60 * 24 * 7
            access_cookie_name = getattr(settings, "SIMPLE_JWT", {}).get("AUTH_COOKIE", "access")

            set_auth_cookies(response, {
                "access": str(new_access),
                "refresh": str(new_refresh)
            })

            return response

        except User.DoesNotExist:
            return Response(
                {"success": False, "code": "USER_NOT_FOUND"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        except TokenError:
            return Response(
                {"success": False, "code": "INVALID_TOKEN"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        except Exception as e:
            print("REFRESH ERROR:", str(e))
            return Response(
                {"success": False, "code": "SERVER_ERROR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# -------------------------------------------------------------
# 🍪 CSRF VIEW
# -------------------------------------------------------------
@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"success": True, "message": "CSRF cookie set"})













# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.views import APIView
# from rest_framework_simplejwt.exceptions import TokenError
# from rest_framework.response import Response
# from .models import User
# from django.db import transaction
# from django.shortcuts import get_object_or_404
# from typing import cast, Dict, Any
# from apps.accounts.serializers import RegisterSerializer, LoginSerializer, UserSerializer
# from apps.accounts.services.auth_service import AuthService
# from .utils.response import api_response
# from apps.accounts.security.rate_limit import is_blocked, record_failure, reset_attempts
# from drf_yasg.utils import swagger_auto_schema
# from django.conf import settings
# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt


# def get_tokens(user):
#     refresh = RefreshToken.for_user(user)
#     return {
#         "access": str(refresh.access_token),
#         "refresh": str(refresh)
#     }

# class AuthViewSet(viewsets.ViewSet):
#     # Register
#     @action(detail=False, methods=["post"], permission_classes=[AllowAny], authentication_classes=[])
#     @transaction.atomic
#     def register(self, request):
#         serializer = RegisterSerializer(data=request.data)

#         if not serializer.is_valid():
#             return api_response(False, "Invalid data", "REGISTER_ERROR", serializer.errors, 400)

#         user = serializer.save()

#         token = AuthService.generate_token(user, "VERIFY_EMAIL", 1440)

#         # ✅ Generate JWT tokens so user is logged in immediately
#         from rest_framework_simplejwt.tokens import RefreshToken
#         refresh = RefreshToken.for_user(user)
#         access_token = str(refresh.access_token)
#         refresh_token = str(refresh)
#         print(f" token refresh show {refresh}")
#         print(f"token accees_token show {access_token}")
#         print(f" refresh token {refresh_token}")

#         response = api_response(
#             True,
#             "Registration successful.",
#             "REGISTER_SUCCESS",
#             {
#                 "user": UserSerializer(user).data,
#                 "verify_token": str(token.token)
#             },
#             status.HTTP_201_CREATED
#         )

#         # ✅ Set the same cookies your login sets
#         response.set_cookie("access", access_token, httponly=True, samesite="Lax", secure=False)
#         response.set_cookie("refresh", refresh_token, httponly=True, samesite="Lax", secure=False)
#         response.set_cookie("logged_in", "true", httponly=False, samesite="Lax", secure=False, max_age=60*60*24*7)

#         return response
#     # 🟢 LOGIN
#     @swagger_auto_schema(request_body=LoginSerializer)
#     @action(detail=False, 
#     methods=["post"], 
#     permission_classes=[AllowAny],
#     authentication_classes=[]
#     )
#     def login(self, request):
#         serializer = LoginSerializer(data=request.data)

#         if not serializer.is_valid():
#             print("")
#             return api_response(False, "Invalid input", "LOGIN_ERROR", serializer.errors, 400)


#         data = cast(Dict[str, Any], serializer.validated_data)
#         user = data["user"]
#         tokens = get_tokens(user)

#         response = Response({
#             "success": True,
#             "message": "Login successful",
#             "code": "LOGIN_SUCCESS",
#             "data": {
#                 "user": UserSerializer(user).data,
#             }
#         })

#         # ✅ Cookies
#         # In login view:
#         response.set_cookie(
#             key="access",
#             value=tokens["access"],
#             httponly=True,
#             secure=not settings.DEBUG,
#             samesite="Lax" if settings.DEBUG else "None",  # ✅
#             max_age=60 * 15,
#             path="/"
#         )

#         response.set_cookie(
#             key="refresh",
#             value=tokens["refresh"],
#             httponly=True,
#             secure=not settings.DEBUG,
#             samesite="Lax" if settings.DEBUG else "None",  # ✅
#             max_age=60 * 60 * 24 * 7,
#             path="/"
#         )

#         return response


#     @action(detail=False, methods=["post"], permission_classes=[AllowAny])
#     def logout(self, request):
#         refresh_token = request.COOKIES.get("refresh")

#         if refresh_token:
#             try:
#                 token = RefreshToken(refresh_token)
#                 token.blacklist()
#             except Exception:
#                 pass

#         response = Response({
#             "success": True,
#             "code": "LOGOUT_SUCCESS",
#             "message": "Logged out successfully"
#         }, status=200)

#         response.set_cookie("access", "", max_age=0, path="/", httponly=True,
#             samesite="Lax" if settings.DEBUG else "None", secure=not settings.DEBUG)
#         response.set_cookie("refresh", "", max_age=0, path="/", httponly=True,
#             samesite="Lax" if settings.DEBUG else "None", secure=not settings.DEBUG)

#         return response

#     # 📧 VERIFY EMAIL
#     @action(detail=False, methods=["post"], permission_classes=[AllowAny])
#     def verify_email(self, request):
#         user = AuthService.verify_token(request.data.get("token"), "VERIFY_EMAIL")

#         if not user:
#             return api_response(False, "Invalid or expired token", "TOKEN_ERROR", status_code=400)

#         user.is_active = True
#         user.save()

#         return api_response(True, "Email verified", "EMAIL_VERIFIED")


#     # 🔑 FORGOT PASSWORD
#     @action(detail=False, methods=["post"],  permission_classes=[AllowAny])
#     def forgot_password(self, request):
#         email = request.data.get("email")

#         try:
#             user = User.objects.get(email=email)
#             token = AuthService.generate_token(user, "RESET_PASSWORD", 30)

#             return api_response(True, "Reset link sent", "RESET_SENT", {
#                 "token": str(token.token)
#             })

#         except User.DoesNotExist:
#             return api_response(False, "User not found", "USER_NOT_FOUND", status_code=404)



#     # 🔁 RESET PASSWORD
#     @action(detail=False, methods=["post"], permission_classes=[AllowAny])
#     def reset_password(self, request):
#         user = AuthService.verify_token(request.data.get("token"), "RESET_PASSWORD")

#         if not user:
#             return api_response(False, "Invalid token", "TOKEN_ERROR", status_code=400)

#         user.set_password(request.data.get("password"))
#         user.save()

#         return api_response(True, "Password reset successful", "PASSWORD_RESET")



#     # 👤 PROFILE
#     @action(detail=False, methods=["get"], url_path="profile/(?P<username>[^/.]+)", permission_classes=[IsAuthenticated])
#     def profile(self, request, username=None):

#         user = get_object_or_404(User, username=username)
#         return api_response(True, "Profile fetched", "PROFILE_SUCCESS", UserSerializer(user).data)



#     # 👤 CURRENT USER (ME)
#     @action(
#         detail=False,
#         methods=["get"],
#         permission_classes=[IsAuthenticated],
#         url_path="me"
#     )
#     def me(self, request):
#         user = request.user

#         # 🛑 Safety check (optional but recommended)
#         if not user or not user.is_authenticated:
#             return api_response(
#                 False,
#                 "Unauthorized",
#                 "UNAUTHORIZED",
#                 status_code=401
#             )

#         return api_response(
#             True,
#             "User fetched successfully",
#             "USER_SUCCESS",
#             UserSerializer(user).data
#         )




# # -------------------------------------------------------------
# # 🔄 TOKEN REFRESH VIEW
# # -------------------------------------------------------------
# # We exempt this from CSRF because if a user's session is dead, 
# # their CSRF token might also be dead. We need them to be able 
# # to rotate their tokens to recover their session.
# @method_decorator(csrf_exempt, name="dispatch")
# class CookieTokenRefreshView(APIView):
#     permission_classes = [AllowAny]
#     authentication_classes = [] # Do not enforce auth on the refresh route itself

#     def post(self, request):
#         # 1. Extract cookie name from settings (fallback to "refresh" if not found)
#         refresh_cookie_name = getattr(settings, "SIMPLE_JWT", {}).get("AUTH_COOKIE_REFRESH", "refresh")
#         refresh_token = request.COOKIES.get(refresh_cookie_name)

#         if not refresh_token:
#             return Response(
#                 {"success": False, "code": "NO_REFRESH_TOKEN"},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         try:
#             # 2. Instantiate token (This AUTOMATICALLY checks validity and the blacklist)
#             old_refresh = RefreshToken(refresh_token)

#             # 3. Get user safely
#             user_id = old_refresh["user_id"]
#             user = User.objects.get(id=user_id)

#             # 4. Rotate refresh token (Blacklist the old one)
#             try:
#                 old_refresh.blacklist()
#             except AttributeError:
#                 # Blacklist app is not enabled in settings
#                 pass

#             # Generate new tokens
#             new_refresh = RefreshToken.for_user(user)
#             new_access = new_refresh.access_token

#             response = Response({
#                 "success": True,
#                 "code": "TOKEN_REFRESHED"
#             })

#             # 5. Cookie config (production-ready and environment-aware)
#             is_secure = not settings.DEBUG
#             cookie_config = {
#                 "httponly": True,
#                 "secure": is_secure,
#                 "samesite": "None" if is_secure else "Lax",
#                 "path": "/",
#             }

#             # 6. Dynamically calculate max_age from settings (prevents desync)
#             access_lifetime = getattr(settings, "SIMPLE_JWT", {}).get("ACCESS_TOKEN_LIFETIME")
#             refresh_lifetime = getattr(settings, "SIMPLE_JWT", {}).get("REFRESH_TOKEN_LIFETIME")
            
#             # Fallbacks in case lifetimes are not explicitly set in settings
#             access_max_age = int(access_lifetime.total_seconds()) if access_lifetime else 60 * 15
#             refresh_max_age = int(refresh_lifetime.total_seconds()) if refresh_lifetime else 60 * 60 * 24 * 7

#             access_cookie_name = getattr(settings, "SIMPLE_JWT", {}).get("AUTH_COOKIE", "access")

#             # Set Access Cookie
#             response.set_cookie(
#                 key=access_cookie_name,
#                 value=str(new_access),
#                 max_age=access_max_age,
#                 **cookie_config
#             )

#             # Set Refresh Cookie
#             response.set_cookie(
#                 key=refresh_cookie_name,
#                 value=str(new_refresh),
#                 max_age=refresh_max_age,
#                 **cookie_config
#             )

#             return response

#         except User.DoesNotExist:
#             return Response(
#                 {"success": False, "code": "USER_NOT_FOUND"},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         except TokenError:
#             # This triggers if the token is expired, invalid, or already blacklisted
#             return Response(
#                 {"success": False, "code": "INVALID_TOKEN"},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         except Exception as e:
#             # Production debugging
#             print("REFRESH ERROR:", str(e))
#             return Response(
#                 {"success": False, "code": "SERVER_ERROR"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )


# # -------------------------------------------------------------
# # 🍪 CSRF VIEW
# # -------------------------------------------------------------
# @method_decorator(ensure_csrf_cookie, name="dispatch")
# class CSRFView(APIView):
#     # Must be AllowAny so the frontend can fetch the CSRF token BEFORE logging in
#     permission_classes = [AllowAny]
#     authentication_classes = []

#     def get(self, request):
#         return Response({"success": True, "message": "CSRF cookie set"})