from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):

    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError("Email or phone is required")

        email = self.normalize_email(email) if email else None

        user = self.model(
            email=email,
            phone=phone,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    # 🔥 PROFESSIONAL SUPERUSER METHOD (NO BUGS)
    def create_superuser(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Superuser must have an email")

        if not full_name:
            raise ValueError("Superuser must have a full_name")

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(
            email=email,
            full_name=full_name,
            password=password,
            **extra_fields
        )