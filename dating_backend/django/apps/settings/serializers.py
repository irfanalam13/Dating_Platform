from rest_framework import serializers
from .models import ProfileSettings


class ProfileSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileSettings
        fields = [
            "id",
            "user",
            "show_dob",
            "show_profile_image",
            "show_location",
            "show_profile_views",
            "anonymous_viewing",
            "is_private",
            "blur_profile_image",
            "updated_at",
        ]
        read_only_fields = ["user", "updated_at"]
