from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from apps.profiles.models.profile import Profile
from apps.report.models import Report
from apps.report.serializers import ReportSerializer
from apps.safety.services.safety_engine import update_user_score


# =====================================================
# 🚨 REPORT USER
# =====================================================
class ReportUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_id):
        profile = get_object_or_404(Profile, id=profile_id)
        target_user = profile.user

        # ❌ prevent self-report
        if target_user == request.user:
            return Response({"error": "You cannot report yourself"}, status=400)

        # ❌ prevent duplicate report
        if Report.objects.filter(reporter=request.user, reported=target_user).exists():
            return Response({"error": "You already reported this user"}, status=400)

        serializer = ReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        report = serializer.save(
            reporter=request.user,
            reported=target_user
        )

        # 🤖 AI safety score update
        update_user_score(target_user, 5)

        return Response({
            "message": "Report submitted successfully"
        }, status=status.HTTP_201_CREATED)


# =====================================================
# 📋 MY REPORTS
# =====================================================
class MyReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reports = Report.objects.filter(reporter=request.user).order_by("-created_at")

        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)
    
    