from rest_framework import serializers
from apps.profiles.models.settings import ProfileSettings


class ProfileSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileSettings
        fields = [
            "id",
            "user",
            "is_private",
            "blur_profile_image",
            "allow_follow",
            "allow_message",
            "updated_at",
        ]
        read_only_fields = ["user", "updated_at"]