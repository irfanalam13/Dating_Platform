from rest_framework import serializers
from .models import PrivacySetting


class PrivacySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacySetting
        fields = "__all__"
        read_only_fields = ["user"]