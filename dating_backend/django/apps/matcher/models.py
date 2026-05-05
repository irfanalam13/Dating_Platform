# matches/models.py

from django.db import models
from django.contrib.auth import get_user_model
from apps.profiles.models.profile import Profile

User = get_user_model()

class Match(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="matches1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="matches2")

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    )

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_matches")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_matches")

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    # Tinder-style swipe info
    is_like = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
        models.UniqueConstraint(
            fields=["user1", "user2"],
            name="unique_match_pair"
        )
    ]
        
    def __str__(self):
        return f"{self.sender} → {self.receiver} ({self.status})"
    


# matches/models.py

class UserInteraction(models.Model):
    ACTION_CHOICES = (
        ("like", "Like"),
        ("pass", "Pass"),
        ("superlike", "Super Like"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    target = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interacted_with")

    action = models.CharField(max_length=10, choices=ACTION_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "target"]),
        ]




class Swipe(models.Model):
    ACTIONS = (
        ("like", "Like"),
        ("pass", "Pass"),
        ("superlike", "Super Like"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="swipes")
    target = models.ForeignKey(User, on_delete=models.CASCADE, related_name="swiped_on")

    action = models.CharField(max_length=10, choices=ACTIONS)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "target")
        indexes = [
            models.Index(fields=["user", "target"]),
            models.Index(fields=["created_at"]),
        ]


