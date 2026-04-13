from rest_framework import serializers
from .models import Profile, ProfileImage


class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = ["id", "image", "is_primary"]


class ProfileSerializer(serializers.ModelSerializer):
    images = ProfileImageSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"
        read_only_fields = ["user", "is_verified", "is_complete"]