from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.profiles.models.profile_view import ProfileView
from apps.profiles.serializers.profile_serializer import ProfileSerializer


class WhoViewedMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        views = (
            ProfileView.objects
            .filter(viewed=request.user)
            .select_related("viewer", "viewer__profile")
            .order_by("-created_at")[:50]
        )

        data = [
            {
                "user_id": v.viewer.id, # type: ignore
                "username": v.viewer.username,
                "viewed_at": v.created_at
            }
            for v in views
        ]

        return Response(data)