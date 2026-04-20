from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ProfileStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_index=True)

    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    posts_count = models.PositiveIntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=["user"]),
        ]