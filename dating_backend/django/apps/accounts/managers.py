from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):

    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError("Email or phone required")

        user = self.model(email=email, phone=phone, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email=email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user