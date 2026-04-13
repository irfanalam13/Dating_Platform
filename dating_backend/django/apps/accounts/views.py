from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from django.db import transaction
from django.shortcuts import get_object_or_404
from typing import cast, Dict, Any

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .services.auth_service import AuthService
from .utils.response import api_response
from .security.rate_limit import is_blocked, record_failure, reset_attempts


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }


class AuthViewSet(viewsets.ViewSet):

    # 🟢 REGISTER
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    @transaction.atomic
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return api_response(False, "Invalid data", "REGISTER_ERROR", serializer.errors, 400)

        user = AuthService.create_user(serializer.validated_data)

        # 📧 create verification token
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
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def login(self, request):
        ip = request.META.get("REMOTE_ADDR")

        if is_blocked(ip):
            return api_response(False, "Too many attempts", "BLOCKED", status_code=429)

        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return api_response(False, "Invalid input", "LOGIN_ERROR", serializer.errors, 400)

        data = cast(Dict[str, Any], serializer.validated_data)

        user = AuthService.login_user(
            data.get("email"),
            data.get("password")
        )
        if not user:
            record_failure(ip)
            return api_response(False, "Invalid credentials", "LOGIN_FAILED", status_code=401)

        if not user.is_active:
            return api_response(False, "Email not verified", "EMAIL_NOT_VERIFIED", status_code=403)

        reset_attempts(ip)

        return api_response(
            True,
            "Login successful",
            "LOGIN_SUCCESS",
            {
                "user": UserSerializer(user).data,
                "tokens": get_tokens(user)
            }
        )


    # 🔴 LOGOUT
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            token = RefreshToken(request.data.get("refresh"))
            token.blacklist()

            return api_response(True, "Logged out", "LOGOUT_SUCCESS")

        except Exception:
            return api_response(False, "Invalid token", "INVALID_TOKEN", status_code=400)


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
    @action(detail=False, methods=["get"], url_path="profile/(?P<username>[^/.]+)", permission_classes=[AllowAny])
    def profile(self, request, username=None):

        user = get_object_or_404(User, username=username)
        return api_response(True, "Profile fetched", "PROFILE_SUCCESS", UserSerializer(user).data)