# apps/matcher/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.profiles.models.profile import Profile, ProfileVector
from apps.matcher.ai_utils import build_profile_vector


REQUIRED_FIELDS = ["gender", "date_of_birth", "city"]


def is_profile_ready(profile):
    return all(getattr(profile, field) for field in REQUIRED_FIELDS)


@receiver(post_save, sender=Profile)
def create_or_update_profile_vector(sender, instance, created, update_fields=None, **kwargs):
    """
    Only build vector when profile is usable.
    Prevents crashes + useless computation.
    """

    # ⛔ Skip incomplete profiles
    if not is_profile_ready(instance):
        return

    # ⚡ Optional: skip if irrelevant fields updated
    if update_fields is not None:
        relevant = {"gender", "date_of_birth", "city", "extra_data"}
        if not relevant.intersection(set(update_fields)):
            return

    vector = build_profile_vector(instance)

    ProfileVector.objects.update_or_create(
        profile=instance,
        defaults={"embedding": vector}  # 👈 use correct field name
    )