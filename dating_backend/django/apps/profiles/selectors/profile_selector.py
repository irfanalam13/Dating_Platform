
from django.core.cache import cache


from django.shortcuts import get_object_or_404

from profiles.models.profile import Profile


CACHE_TIMEOUT = 60 * 5  # 5 minutes


def get_profile_by_user(user):
    return get_object_or_404(
        Profile.objects.select_related("user").only(
            "id", "user_id", "bio", "location", "profile_image"
        ),
        user=user
    )


def get_profile_cached(user_id):
    cache_key = f"profile_basic:{user_id}"

    data = cache.get(cache_key)
    if data:
        return data

    profile = get_object_or_404(
        Profile.objects.select_related("user").only(
            "id", "user_id", "bio", "location", "profile_image"
        ),
        user_id=user_id
    )

    data = {
        "id": profile.id,
        "user_id": profile.user_id,
        "bio": profile.bio,
        "location": profile.location,
        "profile_image": profile.profile_image.url if profile.profile_image else None,
    }

    cache.set(cache_key, data, timeout=CACHE_TIMEOUT)

    return data


def update_profile(user, data):
    profile = Profile.objects.get(user=user)

    for field, value in data.items():
        setattr(profile, field, value)

    profile.save(update_fields=data.keys())

    # 🔥 Clear cache
    cache.delete(f"profile:{user.id}")

    return profile


