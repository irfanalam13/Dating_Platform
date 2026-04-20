from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ProfileView(models.Model):
    viewer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="views_made",
        db_index=True
    )
    viewed = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="views_received",
        db_index=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["viewed", "-created_at"]),
            models.Index(fields=["viewer", "viewed"]),
        ]
        unique_together = ("viewer", "viewed")  # prevent spam