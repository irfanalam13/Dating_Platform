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
from apps.safety.services.safety_engine import analyze_profile
from apps.profiles.services.profile_service import get_profile_data
from apps.privacy.models import PrivacySetting
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
        profile, _ = Profile.objects.get_or_create(user=request.user)

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        data = request.data.copy()
        is_profile_public = data.pop("is_profile_public", None)

        serializer = ProfileSerializer(
            profile,
            data=data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save(user=request.user)

        required_fields = [
            profile.full_name,
            profile.date_of_birth,
            profile.gender,
            profile.city,
            profile.education,
            profile.career,
            profile.values,
            profile.relationship_intent,
        ]
        profile.is_complete = all(bool(value) for value in required_fields)
        profile.save(update_fields=["is_complete"])

        if is_profile_public is not None:
            if isinstance(is_profile_public, list):
                is_profile_public = is_profile_public[0] if is_profile_public else None
            privacy, _ = PrivacySetting.objects.get_or_create(user=request.user)
            privacy.is_profile_public = str(is_profile_public).lower() in ["true", "1", "yes", "public"]
            privacy.allow_messages_from = "matches"
            privacy.save(update_fields=["is_profile_public", "allow_messages_from", "updated_at"])

        # 🤖 AI safety analysis
        analyze_profile(request.user, profile)

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)



class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        profile = get_object_or_404(
            Profile.objects.select_related("user", "religion", "caste", "gotra"),
            user_id=user_id,
        )
        privacy, _ = PrivacySetting.objects.get_or_create(user=profile.user)

        if not privacy.is_profile_public and request.user.id != user_id:
            return Response(
                {"detail": "This account is private"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    

    
