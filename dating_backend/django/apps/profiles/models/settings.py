from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ProfileSettings(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="settings",
        db_index=True
    )

    # Visibility settings
    show_dob = models.BooleanField(default=False)
    show_profile_image = models.BooleanField(default=True)
    show_location = models.BooleanField(default=True)
    show_profile_views = models.BooleanField(default=True)
    anonymous_viewing = models.BooleanField(default=False)
    # Privacy
    is_private = models.BooleanField(default=False)

    # Blur system
    blur_profile_image = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user"]),
        ]