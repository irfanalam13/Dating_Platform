from django.shortcuts import get_object_or_404
from django.core.cache import cache

from apps.profiles.models.profile import Profile


CACHE_TIMEOUT = 60 * 5  # 5 minutes


def get_profile_full_data(viewer, user_id):
    cache_key = f"profile_full:{user_id}"

    data = cache.get(cache_key)
    if data:
        return data

    profile = get_object_or_404(
        Profile.objects
        .select_related("user", "profilestats", "profilesettings")
        .only(
            "id", "user_id", "bio", "location", "profile_image",

            # stats
            "profilestats__followers_count",
            "profilestats__following_count",
            "profilestats__posts_count",

            # settings
            "profilesettings__is_private",
            "profilesettings__blur_profile_image",
        ),
        user_id=user_id
    )

    stats = profile.stats # type: ignore
    settings = profile.settings # pyright: ignore[reportAttributeAccessIssue]

    # 🔐 Privacy Check
    if settings.is_private and (not viewer or viewer.id != user_id):
        return {
            "is_private": True
        }

    # data = {
    #     "profile": profile,
    #     "stats": stats,
    #     "settings": settings,
    #     "is_private": False
    # }
    data = {
        "profile": {
            "bio": profile.bio,
            "location": profile.location,
            "username": profile.user.username,
        },
        "stats": {
            "followers": stats.followers_count,
        },
    }


    # ✅ Cache safe data (short TTL)
    cache.set(cache_key, data, timeout=CACHE_TIMEOUT)

    return data