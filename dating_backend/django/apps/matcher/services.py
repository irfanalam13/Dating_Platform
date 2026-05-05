# apps/matcher/services.py

from pgvector.django import CosineDistance
from django.db import transaction

from apps.profiles.models.profile import ProfileVector
from apps.matcher.models import Swipe, Match


def get_similar_profiles(user, top_k=20):
    try:
        user_vector = ProfileVector.objects.get(profile__user=user)
    except ProfileVector.DoesNotExist:
        return []

    queryset = (
        ProfileVector.objects
        .exclude(profile__user=user)
        .filter(profile__is_active=True, profile__is_flagged=False)
        .select_related("profile", "profile__user")
        .annotate(
            distance=CosineDistance("embedding", user_vector.embedding)
        )
        .order_by("distance")[:top_k]
    )

    return queryset

def hybrid_score(user, target_profile, distance):
    base_score = max(0, 100 - (distance * 100))
    score = base_score

    user_profile = getattr(user, "profile", None)
    preferences = getattr(user, "preferences", None)

    # 📍 Location boost
    if user_profile and target_profile.city and user_profile.city:
        if target_profile.city.lower() == user_profile.city.lower():
            score += 10

    # ❤️ Gender preference (safe)
    target_gender = getattr(target_profile, "gender", None)

    if preferences and target_gender:
        if preferences.preferred_gender in [target_gender, "any"]:
            score += 10

    return min(score, 100)


def handle_swipe(user, target_user, action):
    if user == target_user:
        return {"match": False}

    with transaction.atomic():
        swipe, _ = Swipe.objects.update_or_create(
            user=user,
            target=target_user,
            defaults={"action": action}
        )

        if action not in ["like", "superlike"]:
            return {"match": False}

        reverse_exists = Swipe.objects.filter(
            user=target_user,
            target=user,
            action__in=["like", "superlike"]
        ).exists()

        if not reverse_exists:
            return {"match": False}

        u1, u2 = sorted([user, target_user], key=lambda x: x.id)

        match, created = Match.objects.get_or_create(
            user1=u1,
            user2=u2
        )

        return {
            "match": True,
            "match_id": match.id,
            "is_new": created
        }
    

    