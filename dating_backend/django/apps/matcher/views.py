from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator

from apps.profiles.models.profile import Profile
from .models import Match
from .utils import calculate_match_score

from apps.matcher.signals import is_profile_ready

from apps.notification.services import send_notification


class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        profiles = Profile.objects.exclude(user=user)

        results = []

        for profile in profiles:
            score = calculate_match_score(user, profile)

            results.append({
                "profile_id": profile.id,
                "name": profile.full_name,
                "image": profile.images.first().image.url if profile.images.exists() else None,
                "score": score,
            })

        # 🔥 Sort by score
        results = sorted(results, key=lambda x: x["score"], reverse=True)

        # Pagination
        paginator = Paginator(results, 10)
        page = request.GET.get("page")
        data = paginator.get_page(page)

        return Response({
            "results": data.object_list,
            "total_pages": paginator.num_pages
        })
    
class SendMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_id):
        sender = request.user
        receiver_profile = Profile.objects.get(id=profile_id)
        receiver = receiver_profile.user

                # ✅ Save behavior
        UserInteraction.objects.create(
            user=sender,
            target=receiver,
            action="like"
        )

        match, created = Match.objects.get_or_create(
            sender=sender,
            receiver=receiver
        )

        # 🔥 Check reverse match (mutual like)
        reverse_match = Match.objects.filter(
            sender=receiver,
            receiver=sender,
            is_like=True
        ).first()

        if reverse_match:
            match.status = "accepted"
            reverse_match.status = "accepted"
            match.save()
            reverse_match.save()

            return Response({"message": "It's a match! ❤️"})

        return Response({"message": "Like sent"})
    
class AcceptMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        match = Match.objects.get(id=match_id, receiver=request.user)

        match.status = "accepted"
        match.save()

        return Response({"message": "Match accepted"})


class RejectMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        match = Match.objects.get(id=match_id, receiver=request.user)

        match.status = "rejected"
        match.save()

        return Response({"message": "Match rejected"})
    

class SentMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(sender=request.user)
        return Response([{
            "id": m.id,
            "receiver": m.receiver.email,
            "status": m.status
        } for m in matches])


class ReceivedMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(receiver=request.user)
        return Response([{
            "id": m.id,
            "sender": m.sender.email,
            "status": m.status
        } for m in matches])


class AcceptedMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(
            status="accepted"
        ).filter(
            sender=request.user
        ) | Match.objects.filter(
            status="accepted",
            receiver=request.user
        )

        return Response([{
            "id": m.id,
            "user": m.receiver.email if m.sender == request.user else m.sender.email
        } for m in matches])
    

class SentMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(sender=request.user)
        return Response([{
            "id": m.id,
            "receiver": m.receiver.email,
            "status": m.status
        } for m in matches])


class ReceivedMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(receiver=request.user)
        return Response([{
            "id": m.id,
            "sender": m.sender.email,
            "status": m.status
        } for m in matches])


class AcceptedMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(
            status="accepted"
        ).filter(
            sender=request.user
        ) | Match.objects.filter(
            status="accepted",
            receiver=request.user
        )

        return Response([{
            "id": m.id,
            "user": m.receiver.email if m.sender == request.user else m.sender.email
        } for m in matches])
    



class AIRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ❌ Exclude already interacted users
        interacted_ids = UserInteraction.objects.filter(
            user=user
        ).values_list("target_id", flat=True)

        profiles = Profile.objects.exclude(user=user).exclude(user_id__in=interacted_ids)

        results = []

        for profile in profiles:
            score = ai_match_score(user, profile)

            results.append({
                "profile_id": profile.id, # type: ignore
                "name": profile.full_name,
                "score": round(score, 2),
            })

        results = sorted(results, key=lambda x: x["score"], reverse=True)

        return Response(results[:20])  # top 20 AI matches
    

# matches/views.py

class SwipeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_id):
        action = request.data.get("action")  # like/pass/superlike

        if action not in ["like", "pass", "superlike"]:
            return Response({"error": "Invalid action"}, status=400)

        target_profile = Profile.objects.get(id=profile_id)
        target_user = target_profile.user

        result = handle_swipe(request.user, target_user, action)

        return Response(result)
    



def check_swipe_limit(user):
    today = now() - timedelta(days=1)

    count = Swipe.objects.filter(
        user=user,
        created_at__gte=today
    ).count()

    LIMIT = 10  # free users

    return count < LIMIT

    if not check_swipe_limit(request.user):
        return Response({"error": "Daily swipe limit reached"}, status=403)
    

def exclude_swiped(user, queryset):
    swiped_ids = Swipe.objects.filter(
        user=user
    ).values_list("target_id", flat=True)

    return queryset.exclude(user_id__in=swiped_ids)


    if reverse:
        send_notification(
            user=user,
            data={
                "type": "match",
                "title": "It's a Match ❤️",
                "body": "You both liked each other!"
            }
        )

    send_notification(
        user=target_user,
        data={
            "type": "match",
            "title": "It's a Match ❤️",
            "body": "You both liked each other!"
        }
    )

def get_user_swipe_stats(user):
    return {
        "likes": Swipe.objects.filter(user=user, action="like").count(),
        "passes": Swipe.objects.filter(user=user, action="pass").count(),
        "matches": Match.objects.filter(user1=user).count()
                  + Match.objects.filter(user2=user).count()
    }
