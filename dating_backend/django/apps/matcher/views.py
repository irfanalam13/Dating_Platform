from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.block.views import exclude_blocked_users
from apps.privacy.models import PrivacySetting
from apps.profiles.models.profile import Profile
from apps.profiles.serializers.profile_serializer import ProfileSerializer

from .models import Match, UserInteraction


def ordered_pair(user_a, user_b):
    return (user_a, user_b) if user_a.id < user_b.id else (user_b, user_a)


def compatibility_tags(user, profile):
    tags = []
    my_profile = getattr(user, "profile", None)

    if my_profile:
        if my_profile.city and profile.city and my_profile.city.lower() == profile.city.lower():
            tags.append("Same city")
        if my_profile.career and profile.career and my_profile.career.lower() == profile.career.lower():
            tags.append("Career aligned")
        if my_profile.values and profile.values:
            mine = {item.strip().lower() for item in my_profile.values.split(",") if item.strip()}
            theirs = {item.strip().lower() for item in profile.values.split(",") if item.strip()}
            if mine.intersection(theirs):
                tags.append("Shared values")
        if my_profile.religion_id and my_profile.religion_id == profile.religion_id:
            tags.append("Cultural preferences match")

    if not tags:
        tags.append("Meaningful profile")

    return tags[:4]


class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        interacted_ids = UserInteraction.objects.filter(user=request.user).values_list("target_id", flat=True)
        profiles = Profile.objects.select_related("user", "religion", "caste", "gotra").exclude(
            user=request.user
        ).exclude(
            user_id__in=interacted_ids
        ).filter(
            is_active=True
        )
        profiles = exclude_blocked_users(request.user, profiles)

        visible_ids = PrivacySetting.objects.filter(is_profile_public=False).values_list("user_id", flat=True)
        profiles = profiles.exclude(user_id__in=visible_ids)

        data = []
        for profile in profiles[:20]:
            item = ProfileSerializer(profile, context={"request": request}).data
            item["compatibility_tags"] = compatibility_tags(request.user, profile)
            data.append(item)

        return Response({"results": data})


class SendMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_id):
        action = request.data.get("action", "like")
        if action not in ["like", "pass"]:
            return Response({"error": "Action must be like or pass"}, status=400)

        receiver_profile = get_object_or_404(Profile, id=profile_id)
        receiver = receiver_profile.user

        if receiver == request.user:
            return Response({"error": "You cannot match with yourself"}, status=400)

        UserInteraction.objects.update_or_create(
            user=request.user,
            target=receiver,
            defaults={"action": action},
        )

        if action == "pass":
            return Response({"message": "Profile passed", "matched": False})

        user1, user2 = ordered_pair(request.user, receiver)
        match, _ = Match.objects.get_or_create(
            user1=user1,
            user2=user2,
            defaults={
                "sender": request.user,
                "receiver": receiver,
                "is_like": True,
                "status": "pending",
            },
        )

        reverse_like = UserInteraction.objects.filter(
            user=receiver,
            target=request.user,
            action="like",
        ).exists()

        if reverse_like:
            match.status = "accepted"
            match.save(update_fields=["status"])
            return Response({
                "message": "You both are interested",
                "matched": True,
                "match_id": match.id,
            })

        return Response({"message": "Interest sent", "matched": False, "match_id": match.id})


class AcceptMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        if request.user not in [match.user1, match.user2]:
            return Response({"error": "Access denied"}, status=403)
        match.status = "accepted"
        match.save(update_fields=["status"])
        return Response({"message": "Match accepted"})


class RejectMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        if request.user not in [match.user1, match.user2]:
            return Response({"error": "Access denied"}, status=403)
        match.status = "rejected"
        match.save(update_fields=["status"])
        return Response({"message": "Match rejected"})


class SentMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(sender=request.user)
        return Response([{"id": m.id, "receiver": m.receiver.email, "status": m.status} for m in matches])


class ReceivedMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(receiver=request.user)
        return Response([{"id": m.id, "sender": m.sender.email, "status": m.status} for m in matches])


class AcceptedMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(Q(user1=request.user) | Q(user2=request.user), status="accepted")
        data = []
        for match in matches:
            other = match.user2 if match.user1 == request.user else match.user1
            profile = getattr(other, "profile", None)
            data.append({
                "id": match.id,
                "user_id": other.id,
                "email": other.email,
                "name": profile.full_name if profile else other.full_name,
                "profile_id": profile.id if profile else None,
                "profile_image": profile.profile_image.url if profile and profile.profile_image else None,
            })
        return Response(data)
