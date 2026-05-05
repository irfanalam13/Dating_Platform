import math
from apps.profiles.models.profile import Profile
from apps.profiles.models.profile import ProfileVector
from apps.matcher.ai_utils import cosine_similarity



def get_profile_data(user):
    profile = user.profile  # assuming OneToOne relation

    return {
        "profile": {
            "id": profile.id,
            "bio": profile.bio or "",
            "location": profile.location or "",
            "profile_image": profile.profile_image.url if profile.profile_image else None,
        },
        "stats": {
            "followers": profile.followers.count(),
            "following": profile.following.count(),
            "posts": profile.posts.count(),
        },
        "settings": {
            "is_private": profile.is_private,
            "blur": profile.blur,
        },
    }


# ----------------------------------------
# 📍 Haversine Distance Function
# ----------------------------------------
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in KM

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2 +
        math.cos(math.radians(lat1)) *
        math.cos(math.radians(lat2)) *
        math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# ----------------------------------------
# 👤 Update Profile
# ----------------------------------------
def update_profile(user, data):
    profile = Profile.objects.get(user=user)

    for field, value in data.items():
        setattr(profile, field, value)

    profile.save(update_fields=data.keys())
    return profile


# ----------------------------------------
# 📍 Get Nearby Profiles (NO GIS)
# ----------------------------------------
def get_nearby_profiles(user, radius_km=50):
    user_profile = Profile.objects.get(user=user)

    if not user_profile.latitude or not user_profile.longitude:
        return []

    profiles = Profile.objects.exclude(user=user)

    nearby_profiles = []

    for profile in profiles:
        if profile.latitude and profile.longitude:
            distance = calculate_distance(
                user_profile.latitude,
                user_profile.longitude,
                profile.latitude,
                profile.longitude
            )

            if distance <= radius_km:
                nearby_profiles.append(profile)

    return nearby_profiles


# ----------------------------------------
# 🤖 Geo + AI Matching
# ----------------------------------------
def get_geo_ai_matches(user, radius_km=50):
    nearby_profiles = get_nearby_profiles(user, radius_km)

    try:
        user_vector = ProfileVector.objects.get(profile__user=user)
    except ProfileVector.DoesNotExist:
        return []

    results = []

    for profile in nearby_profiles:
        try:
            target_vector = ProfileVector.objects.get(profile=profile)

            similarity = cosine_similarity(
                user_vector.embedding,
                target_vector.embedding
            )

            results.append({
                "profile": profile,
                "score": round(similarity * 100, 2)
            })

        except ProfileVector.DoesNotExist:
            continue

    # Sort by highest score
    results.sort(key=lambda x: x["score"], reverse=True)

    return results