# apps/accounts/backends.py

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class PhoneOrEmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = None

            # Try email
            if username and "@" in username:
                user = User.objects.filter(email=username).first()
            else:
                user = User.objects.filter(phone=username).first()

            if user and user.check_password(password):
                return user

        except Exception:
            return None