from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    TYPE_CHOICES = (
        ("match", "Match"),
        ("message", "Message"),
        ("system", "System"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")

    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)

    # Optional references
    conversation_id = models.IntegerField(null=True, blank=True)
    profile_id = models.IntegerField(null=True, blank=True)

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.notification_type}"
    
    