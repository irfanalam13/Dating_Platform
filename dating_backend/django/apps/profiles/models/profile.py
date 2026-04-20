from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
        db_index=True
    )

    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, db_index=True)

    profile_image = models.ImageField(upload_to="profiles/", null=True, blank=True)

    date_of_birth = models.DateField(null=True, blank=True)

    is_active = models.BooleanField(default=True, db_index=True)

    extra_data = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["location"]),
            models.Index(fields=["is_active"]),
        ]