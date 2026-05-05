# signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.profiles.models.profile import Profile, ProfileVector
from apps.ai.embedding import generate_embedding


@receiver(post_save, sender=Profile)
def update_embedding(sender, instance, **kwargs):
    embedding = generate_embedding(instance)

    ProfileVector.objects.update_or_create(
        profile=instance,
        defaults={"embedding": embedding}
    )
    