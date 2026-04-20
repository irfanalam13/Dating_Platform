from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from profiles.models.profile import Profile
from profiles.models.profile_stats import ProfileStats
from profiles.models.settings import ProfileSettings

from profiles.serializers.profile_serializer import ProfileSerializer
from profiles.services.profile_service import update_profile
from profiles.services.profile_view_service import track_profile_view


# 🔥 Aggregator (Best Practice)
def get_profile_full_data(user_id):
    profile = get_object_or_404(
        Profile.objects
        .select_related("user", "profilestats", "profilesettings")
        .only(
            "id", "user_id", "bio", "location", "profile_image",
            "profilestats__followers_count",
            "profilestats__following_count",
            "profilestats__posts_count",
            "profilesettings__is_private",
            "profilesettings__blur_profile_image"
        ),
        user_id=user_id
    )

    return {
        "profile": profile,
        "stats": profile.profilestats,
        "settings": profile.profilesettings
    }


# ✅ Self Profile View
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(
            Profile.objects.select_related("user"),
            user=request.user
        )

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        profile = update_profile(request.user, request.data)
        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ Other User Profile View (Optimized)
class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        data = get_profile_full_data(user_id)

        # 🔐 Privacy Check
        if data["settings"].is_private and request.user.id != user_id:
            return Response(
                {"detail": "This account is private"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProfileSerializer(
            data["profile"],
            context={"request": request}
        )

        # 📊 Track profile view (async recommended in future)
        track_profile_view(request.user, user_id)

        return Response({
            "profile": serializer.data,
            "stats": {
                "followers": data["stats"].followers_count,
                "following": data["stats"].following_count,
                "posts": data["stats"].posts_count,
            },
            "settings": {
                "is_private": data["settings"].is_private,
                "blur": data["settings"].blur_profile_image,
            }
        }, status=status.HTTP_200_OK)