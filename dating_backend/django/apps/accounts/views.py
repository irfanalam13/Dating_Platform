from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from django.db import transaction
from django.shortcuts import get_object_or_404
from typing import cast, Dict, Any
from apps.accounts.serializers import RegisterSerializer, LoginSerializer, UserSerializer
from apps.accounts.services.auth_service import AuthService
from .utils.response import api_response
from apps.accounts.security.rate_limit import is_blocked, record_failure, reset_attempts
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from django.conf import settings
from rest_framework_simplejwt.exceptions import TokenError
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }


class AuthViewSet(viewsets.ViewSet):

    # 🟢 REGISTER
    @swagger_auto_schema(request_body=RegisterSerializer)
    @action(detail=False, 
    methods=["post"], 
    permission_classes=[AllowAny],
    authentication_classes=[]
    )
    @transaction.atomic
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return api_response(False, "Invalid data", "REGISTER_ERROR", serializer.errors, 400)

        user = serializer.save()

        token = AuthService.generate_token(user, "VERIFY_EMAIL", 1440)

        return api_response(
            True,
            "Registration successful. Verify your email.",
            "REGISTER_SUCCESS",
            {
                "user": UserSerializer(user).data,
                "verify_token": str(token.token)
            },
            status.HTTP_201_CREATED
        )

    # 🟢 LOGIN
    @swagger_auto_schema(request_body=LoginSerializer)
    @action(detail=False, 
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

        # ✅ Cookies
        response.set_cookie(
            key="access",
            value=tokens["access"],
            httponly=True,
            secure=not settings.DEBUG,
            samesite="None" if not settings.DEBUG else "Lax",
            max_age=60 * 15,  # 15 minutes
            path="/"
        )

        response.set_cookie(
            key="refresh",
            value=tokens["refresh"],
            httponly=True,
            secure=not settings.DEBUG,
            samesite="None" if not settings.DEBUG else "Lax",
            max_age=60 * 60 * 24 * 7,  # 7 days
            path="/"
        )

        return response



    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def logout(self, request):
        refresh_token = request.COOKIES.get("refresh")

        # 🔐 Try to blacklist refresh token
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass  # already invalid or expired

        response = Response({
            "success": True,
            "code": "LOGOUT_SUCCESS",
            "message": "Logged out successfully"
        }, status=200)

        # 🍪 Cookie config (must match login)
        cookie_config = {
            "path": "/",
            "samesite": "None" if not settings.DEBUG else "Lax",
            "secure": not settings.DEBUG,
        }

        response.delete_cookie("access", **cookie_config)
        response.delete_cookie("refresh", **cookie_config)

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
    @action(detail=False, methods=["post"],  permission_classes=[AllowAny])
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
    @action(detail=False, methods=["get"], url_path="profile/(?P<username>[^/.]+)", permission_classes=[IsAuthenticated])
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

        # 🛑 Safety check (optional but recommended)
        if not user or not user.is_authenticated:
            return api_response(
                False,
                "Unauthorized",
                "UNAUTHORIZED",
                status_code=401
            )

        return api_response(
            True,
            "User fetched successfully",
            "USER_SUCCESS",
            UserSerializer(user).data
        )



class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "success": True,
            "data": {
                "id": request.user.id,
                "email": request.user.email,
                "username": request.user.username
            }
        })


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if not refresh_token:
            return Response(
                {"success": False, "code": "NO_REFRESH_TOKEN"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            old_refresh = RefreshToken(refresh_token)

            # 🔐 1. Reuse detection (VERY IMPORTANT)
            try:
                if old_refresh.check_blacklist():
                    return Response(
                        {"success": False, "code": "TOKEN_REUSED"},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except AttributeError:
                # blacklist app not enabled
                pass

            # 👤 2. Get user safely
            user_id = old_refresh["user_id"]
            user = User.objects.get(id=user_id)

            # 🔁 3. Rotate refresh token
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

            # 🍪 4. Cookie config (production-ready)
            cookie_config = {
                "httponly": True,
                "secure": not settings.DEBUG,
                "samesite": "None" if not settings.DEBUG else "Lax",
                "path": "/",
            }

            response.set_cookie(
                key="access",
                value=str(new_access),
                max_age=60 * 15,
                **cookie_config
            )

            response.set_cookie(
                key="refresh",
                value=str(new_refresh),
                max_age=60 * 60 * 24 * 7,
                **cookie_config
            )

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
            # 🧠 Production debugging
            print("REFRESH ERROR:", str(e))
            return Response(
                {"success": False, "code": "SERVER_ERROR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        



@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFView(APIView):
    def get(self, request):
        return Response({"success": True})
