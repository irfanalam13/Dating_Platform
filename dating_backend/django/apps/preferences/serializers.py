from rest_framework import serializers
from apps.profiles.models.profile import Profile, ProfileImage
from .models import  CulturalProfile, Preferences

class CulturalProfileSerializer(serializers.ModelSerializer):
    religion = serializers.StringRelatedField()
    caste = serializers.StringRelatedField()
    gotra = serializers.StringRelatedField()

    class Meta:
        model = CulturalProfile
        fields = "__all__"

class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preferences
        fields = "__all__"