from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


# 🔥 USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):
    profile_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "username", "profile_url"]

    # def get_profile_url(self, obj):
    #     return f"/{obj.user.username}"
    def get_profile_url(self, obj):
        return f"/{obj.username}"


# 🟢 REGISTER SERIALIZER
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["full_name", "username", "email", "password", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match"
            })
        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")

        user = User.objects.create_user(**validated_data) # type: ignore
        user.set_password(password)
        user.is_active = True  # ⚠️ dev only
        user.save()

        return user


# 🔐 LOGIN SERIALIZER
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        help_text="Enter your registered email"
    )
    password = serializers.CharField(
        write_only=True,
        help_text="Enter your password"
    )

    # 👉 Add this for Swagger UI labels
    class Meta:
        fields = ["email", "password"]

    def validate(self, data):
        user = authenticate(
            username=data.get("email"),
            password=data.get("password")
        )

        if not user:
            raise serializers.ValidationError({
                "detail": "Invalid email or password"
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "detail": "Account not verified"
            })

        data["user"] = user
        return data


