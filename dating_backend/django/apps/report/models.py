from django.db import models
from apps.accounts.models import User

# 🚨 Report System
class Report(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("reviewed", "Reviewed"),
        ("action_taken", "Action Taken"),
        ("rejected", "Rejected"),
    ]

    REASON_CHOICES = [
        ("spam", "Spam"),
        ("fake", "Fake Profile"),
        ("abuse", "Abusive Behavior"),
        ("nudity", "Inappropriate Content"),
        ("other", "Other"),
    ]

    reporter = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reports_made"
    )
    reported = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reports_received"
    )

    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    description = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)


    class Meta:
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["reported"]),
        ]

        def __str__(self):
            return f"{self.reporter} → {self.reported} ({self.reason})" # type: ignore