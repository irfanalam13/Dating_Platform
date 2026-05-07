from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.text import slugify
from django.utils import timezone
import uuid
from .managers import UserManager



class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=255, null=True, blank=True)
    # 🔥 Public identity (profile URL)
    username = models.SlugField(max_length=150, unique=True, blank=True)

    # 🔐 Auth fields
    email = models.EmailField(unique=True, null=False, blank=False)
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)

    # is_active = models.BooleanField(default=False)  # email verification required
    is_active = models.BooleanField(default=True)  # ✅ active by default for MVP
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]  # 🔥 IMPORTANT for createsuperuser

    def save(self, *args, **kwargs):
        if not self.username:
            base = slugify(self.full_name) or "user" # type: ignore
            username = base
            counter = 1

            # 🔥 Ensure unique username
            while User.objects.filter(username=username).exists():
                username = f"{base}{counter}"
                counter += 1

            self.username = username



        super().save(*args, **kwargs)

    def __str__(self):
        return self.username or self.email



# 🔐 TOKEN MODEL (EMAIL VERIFY + RESET PASSWORD)
class AuthToken(models.Model):
    TOKEN_TYPES = (
        ("VERIFY_EMAIL", "VERIFY_EMAIL"),
        ("RESET_PASSWORD", "RESET_PASSWORD"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tokens")

    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    type = models.CharField(max_length=20, choices=TOKEN_TYPES)
    is_used = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=["token"]),
            models.Index(fields=["user", "type"]),
        ]

    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()

    def __str__(self):
        return f"{self.user} - {self.type}"