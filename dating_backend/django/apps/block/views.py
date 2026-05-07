from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.accounts.models import User
from apps.block.models import Block
from apps.profiles.models.profile import Profile
from apps.block.serializers import BlockSerializer

def exclude_blocked(user, queryset):
    blocked_ids = Block.objects.filter(
        blocker=user
    ).values_list("blocked_id", flat=True)

    return queryset.exclude(user_id__in=blocked_ids)

BAD_WORDS = ["spam", "scam", "fake"]


def moderate_text(text):
    for word in BAD_WORDS:
        if word in text.lower():
            return False
    return True



class BlockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_id):
        target = Profile.objects.get(id=profile_id).user

        if target == request.user:
            return Response({"error": "You cannot block yourself"}, status=400)

        Block.objects.get_or_create(
            blocker=request.user,
            blocked=target
        )

        return Response({"message": "User blocked"})    

class BlockListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        blocks = Block.objects.filter(blocker=request.user).select_related("blocked")

        serializer = BlockSerializer(blocks, many=True)
        return Response(serializer.data)
    


class UnblockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, profile_id):
        target = Profile.objects.get(id=profile_id).user

        Block.objects.filter(
            blocker=request.user,
            blocked=target
        ).delete()

        return Response({"message": "User unblocked"})
    

def exclude_blocked_users(user, queryset):
    blocked = Block.objects.filter(blocker=user).values_list("blocked_id", flat=True)
    blocked_by = Block.objects.filter(blocked=user).values_list("blocker_id", flat=True)

    return queryset.exclude(user_id__in=blocked).exclude(user_id__in=blocked_by)
