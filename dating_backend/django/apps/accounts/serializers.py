from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


# 🔥 USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):
    profile_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "username", "profile_url"]

    def get_profile_url(self, obj):
        return f"/{obj.username}"  # 🔥 frontend-friendly


# 🟢 REGISTER SERIALIZER
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["full_name", "username", "email", "password", "confirm_password"]

    # 🔥 VALIDATION
    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match"
            })

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({
                "email": "Email already exists"
            })

        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError({
                "username": "Username already taken"
            })

        return data

    # 🔥 CREATE USER
    def create(self, validated_data):
        validated_data.pop("confirm_password")

        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user


# 🔐 LOGIN SERIALIZER
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(username=email, password=password)

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