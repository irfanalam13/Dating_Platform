from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class PrivacySetting(models.Model):
    MESSAGE_CHOICES = [
        ("everyone", "Everyone"),
        ("matches", "Matches Only"),
        ("none", "No One"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="privacy")

    show_age = models.BooleanField(default=True)
    show_location = models.BooleanField(default=True)
    show_profile_image = models.BooleanField(default=True)

    allow_messages_from = models.CharField(
        max_length=20,
        choices=MESSAGE_CHOICES,
        default="everyone"
    )

    is_profile_public = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Privacy - {self.user.email}"
    
    