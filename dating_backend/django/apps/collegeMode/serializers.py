from rest_framework import serializers

from .models import StudentVerification


class StudentVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentVerification
        fields = [
            "id",
            "college_name",
            "college_email",
            "student_id_image",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at"]
