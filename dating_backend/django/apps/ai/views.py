from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# from pgvector.django import VectorField
from django.db import models

from apps.matcher.services import get_similar_profiles, hybrid_score


class ProductionRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        similar_profiles = get_similar_profiles(user)

        results = []

        for item in similar_profiles:
            profile = getattr(item, "profile", None)
            if not profile:
                continue

            distance = item.distance # pyright: ignore[reportAttributeAccessIssue]
            score = hybrid_score(user, profile, distance)

            results.append({
                "profile_id": profile.id,
                "name": profile.full_name,
                "score": round(score, 2),
            })

        results = sorted(results, key=lambda x: x["score"], reverse=True)[:20]

        return Response({"results": results})


def behavior_boost(user, target_user):
    from apps.matcher.models import UserInteraction

    liked_profiles = set(UserInteraction.objects.filter(
        user=user,
        action="like"
    ).values_list("target_id", flat=True))

    return 15 if target_user.id in liked_profiles else 0


class ProfileVector(models.Model):
    # embedding = VectorField(dimensions=384)
    embedding = models.JSONField(null=True, blank=True)

    