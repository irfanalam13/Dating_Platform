# apps/accounts/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.accounts.models import User
from apps.profiles.models.profile import Profile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)
        

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Save Profile whenever User is updated
    """
    if hasattr(instance, "profile"):
        instance.profile.save()