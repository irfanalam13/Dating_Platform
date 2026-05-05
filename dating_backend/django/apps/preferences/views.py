from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from apps.profiles.models import profile
from .models import CulturalProfile, Preferences
from .serializers import CulturalProfileSerializer, PreferencesSerializer
from apps.profiles.serializers.profile_serializer import ProfileSerializer
from apps.profiles.models.profile import Profile


# ✅ Create Profile
class CreateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ✅ Get My Profile
class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


# ✅ Update Profile
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ✅ Public Profile
class PublicProfileView(APIView):
    def get(self, request, id, ):
        profile = get_object_or_404(Profile, id=id)

        if profile.is_private:
            return Response({"error": "Private account"}, status=403)

        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    


class CulturalProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        profile = Profile.objects.select_related(
            "user"
        ).prefetch_related(
            "cultural__religion",
            "cultural__caste",
            "cultural__gotra"
        ).get(user__username=username)
        
        serializer = CulturalProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


class UpdateCulturalProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        cultural = CulturalProfile.objects.get(profile=profile)

        serializer = CulturalProfileSerializer(cultural, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    

class PreferencesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pref = Preferences.objects.get(user=request.user)
        serializer = PreferencesSerializer(pref)
        return Response(serializer.data)

    def post(self, request):
        serializer = PreferencesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


class UpdatePreferencesView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        pref = Preferences.objects.get(user=request.user)

        serializer = PreferencesSerializer(pref, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)