from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class SafetyScore(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="safety_score")

    score = models.FloatField(default=0)  # 0 = safe, higher = risky
    is_flagged = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)

    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - Score: {self.score}"