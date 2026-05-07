from rest_framework import serializers
from .models import Block


class BlockSerializer(serializers.ModelSerializer):
    blocked_email = serializers.CharField(source="blocked.email", read_only=True)
    blocked_profile_id = serializers.IntegerField(source="blocked.profile.id", read_only=True)

    class Meta:
        model = Block
        fields = ["id", "blocked", "blocked_email", "blocked_profile_id", "created_at"]
