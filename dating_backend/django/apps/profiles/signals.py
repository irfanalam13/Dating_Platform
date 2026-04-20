# profiles/signals.py

from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from apps.profiles.models.profile import Profile

User = get_user_model()

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    Profile.objects.get_or_create(user=instance)
    
