from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from apps.profiles.models.profile import Profile, ProfileImage
from ..serializers.profile_serializer import ProfileSerializer, ProfileImageSerializers
from apps.profiles.services.profile_service import update_profile, get_geo_ai_matches
from apps.profiles.services.profile_view_service import track_profile_view
from apps.safety.services.safety_engine import analyze_profile
from apps.profiles.services.profile_service import get_profile_data
from rest_framework import viewsets

User = get_user_model()



def profile_detail(request, username):
    try:
        user = User.objects.get(username=username)

        data = get_profile_data(user)

        return Response({
            "success": True,
            "data": data
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({
            "success": False,
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)

# =====================================================
# 🔥 Aggregator (clean + reusable)
# =====================================================
def get_profile_full_data(user_id):
    profile = get_object_or_404(
        Profile.objects.select_related("user", "profilestats", "profilesettings"),
        user_id=user_id
    )

    return {
        "profile": profile,
        "stats": profile.stats,
        "settings": profile.settings,
    }


# =====================================================
# 🌐 Public Profile by Username
# =====================================================
@api_view(["GET"])
@permission_classes([AllowAny])
def get_profile_by_username(request, username):
    user = get_object_or_404(User.objects.only("id", "username"), username=username)

    data = get_profile_full_data(user.id) # pyright: ignore[reportAttributeAccessIssue]

    # 🔐 Privacy
    if data["settings"].is_private:
        return Response({
            "is_private": True,
            "username": user.username
        })

    profile = data["profile"]
    stats = data["stats"]

    return Response({
        "username": profile.user.username,
        "full_name": profile.user.get_full_name(),
        "bio": profile.bio,
        "location": profile.location,
        "profile_image": profile.profile_image.url if profile.profile_image else None,
        "followers": stats.followers_count,
        "following": stats.following_count,
        "posts": stats.posts_count,
    })


# =====================================================
# 👤 SELF PROFILE (GET, UPDATE)
# =====================================================
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        profile = update_profile(request.user, request.data)

        # 🤖 AI safety analysis
        analyze_profile(request.user, profile)

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)



class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        # 1. Get full structured data from service
        data = get_profile_full_data(user_id)

        # 2. Privacy check (FIXED)
        if data["settings"]["is_private"] and request.user.id != user_id:
            return Response(
                {"detail": "This account is private"},
                status=status.HTTP_403_FORBIDDEN
            )

        # 3. Track profile view
        track_profile_view(request.user, user_id)

        # 4. Serialize profile only (clean separation)
        serializer = ProfileSerializer(
            data["profile"],
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        # 5. Final response (clean + consistent)
        return Response(
            {
                "success": True,
                "data": {
                    "profile": serializer.data,
                    "stats": {
                        "followers": data["stats"]["followers_count"],
                        "following": data["stats"]["following_count"],
                        "posts": data["stats"]["posts_count"],
                    },
                    "settings": {
                        "is_private": data["settings"]["is_private"],
                        "blur": data["settings"]["blur_profile_image"],
                    },
                }
            },
            status=status.HTTP_200_OK
        )

# =====================================================
# 🖼️ IMAGE MANAGEMENT
# =====================================================
class UploadImageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = get_object_or_404(Profile, user=request.user)

        serializer = ProfileImageSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(profile=profile)

        return Response(serializer.data)

class ProfileImageViewSet(viewsets.ModelViewSet):
    queryset = ProfileImage.objects.all()
    serializer_class = ProfileImageSerializers

    def perform_create(self, serializer):
        # If the new image is set to primary, unset the existing primary image
        if serializer.validated_data.get('is_primary'):
            ProfileImage.objects.filter(
                profile=serializer.validated_data['profile'], 
                is_primary=True
            ).update(is_primary=False)
        
        serializer.save()

    def perform_update(self, serializer):
        # If updating an existing image to be primary, unset others
        if serializer.validated_data.get('is_primary'):
            ProfileImage.objects.filter(
                profile=serializer.instance.profile, 
                is_primary=True
            ).exclude(pk=serializer.instance.pk).update(is_primary=False)
            
        serializer.save()

class DeleteImageView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        image = get_object_or_404(ProfileImage, id=id, profile__user=request.user)
        image.delete()

        return Response({"message": "Deleted"})


# =====================================================
# 📍 LOCATION UPDATE
# =====================================================
class UpdateLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            lat = float(request.data.get("lat"))
            lng = float(request.data.get("lng"))
        except (TypeError, ValueError):
            return Response({"error": "Invalid coordinates"}, status=400)

        profile = get_object_or_404(Profile, user=request.user)

        profile.latitude = lat
        profile.longitude = lng
        profile.save(update_fields=["latitude", "longitude"])

        return Response({"message": "Location updated"})


# =====================================================
# 🤖 AI + GEO MATCHING
# =====================================================
class GeoAIRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = get_geo_ai_matches(request.user)

        results = [
            {
                "id": item["profile"].id,
                "name": item["profile"].full_name,
                "city": item["profile"].city,
                "latitude": item["profile"].latitude,
                "longitude": item["profile"].longitude,
                "score": round(item["score"], 2),
            }
            for item in matches[:20]
        ]

        return Response({"results": results})
    

    