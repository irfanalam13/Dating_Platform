from rest_framework import serializers
from apps.privacy.models import PrivacySetting


class PrivacySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacySetting
        fields = "__all__"
        read_only_fields = ["user"]

