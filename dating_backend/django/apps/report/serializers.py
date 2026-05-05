from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    reported_email = serializers.CharField(source="reported.email", read_only=True)

    class Meta:
        model = Report
        fields = "__all__"
        read_only_fields = ["reporter", "status"]


