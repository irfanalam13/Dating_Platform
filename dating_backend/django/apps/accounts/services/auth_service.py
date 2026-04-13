from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate
from django.db import transaction

from ..models import User, AuthToken


class AuthService:

    # 🟢 CREATE USER (CLEAN + SAFE)
    @staticmethod
    @transaction.atomic
    def create_user(data):
        # 🔥 Copy data (avoid mutation)
        user_data = data.copy()

        password = user_data.pop("password")

        # 🔥 Normalize email
        if user_data.get("email"):
            user_data["email"] = user_data["email"].lower().strip()

        # 🔥 Create user
        user = User(**user_data)
        user.set_password(password)
        user.save()

        return user


    # 🔑 GENERATE TOKEN
    @staticmethod
    def generate_token(user, token_type, expiry_minutes=60):
        return AuthToken.objects.create(
            user=user,
            type=token_type,
            expires_at=timezone.now() + timedelta(minutes=expiry_minutes)
        )


    # ✅ VERIFY TOKEN
    @staticmethod
    def verify_token(token_value, token_type):
        try:
            token = AuthToken.objects.get(token=token_value, type=token_type)

            if not token.is_valid():
                return None

            # 🔥 mark as used
            token.is_used = True
            token.save(update_fields=["is_used"])

            return token.user

        except AuthToken.DoesNotExist:
            return None


    # 🔐 LOGIN USER
    @staticmethod
    def login_user(email, password):
        if not email or not password:
            return None

        # 🔥 Normalize email
        email = email.lower().strip()

        user = authenticate(username=email, password=password)

        if not user:
            return None

        if not user.is_active:
            return None  # handled in serializer/view

        return user