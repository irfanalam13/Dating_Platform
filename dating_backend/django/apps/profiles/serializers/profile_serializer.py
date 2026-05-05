from rest_framework import serializers
from apps.profiles.models.profile import Profile, ProfileImage
from apps.preferences.serializers import CulturalProfileSerializer

class ProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    profile = serializers.DictField()
    stats = serializers.DictField()
    settings = serializers.DictField()
    cultural = CulturalProfileSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url) # type: ignore
        return None
    

class ProfileImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = '__all__'
        read_only_fields = ['created_at']
