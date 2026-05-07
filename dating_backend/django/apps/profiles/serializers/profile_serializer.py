from rest_framework import serializers
from apps.profiles.models.profile import Profile, ProfileImage
from apps.privacy.models import PrivacySetting

class ProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    religion_name = serializers.CharField(source="religion.name", read_only=True)
    caste_name = serializers.CharField(source="caste.name", read_only=True)
    gotra_name = serializers.CharField(source="gotra.name", read_only=True)
    is_profile_public = serializers.SerializerMethodField()
    verified = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "full_name",
            "bio",
            "city",
            "latitude",
            "longitude",
            "profile_image",
            "profile_image_url",
            "gender",
            "date_of_birth",
            "age",
            "relationship_intent",
            "education",
            "career",
            "values",
            "hobbies",
            "preferences",
            "religion",
            "religion_name",
            "caste",
            "caste_name",
            "gotra",
            "gotra_name",
            "ethnicity",
            "gan",
            "horoscope",
            "is_complete",
            "is_profile_public",
            "verified",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "is_complete", "created_at", "updated_at"]

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
        return None

    def get_age(self, obj):
        return obj.age()

    def get_is_profile_public(self, obj):
        privacy, _ = PrivacySetting.objects.get_or_create(user=obj.user)
        return privacy.is_profile_public

    def get_verified(self, obj):
        verification = getattr(obj.user, "verification", None)
        return bool(verification and verification.status == "approved")
    

class ProfileImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = '__all__'
        read_only_fields = ['created_at']
