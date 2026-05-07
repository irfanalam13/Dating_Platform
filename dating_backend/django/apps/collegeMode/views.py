from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StudentVerification
from .serializers import StudentVerificationSerializer


class StudentVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        verification = StudentVerification.objects.filter(user=request.user).first()
        if not verification:
            return Response({"status": "not_submitted"})
        return Response(StudentVerificationSerializer(verification, context={"request": request}).data)

    def post(self, request):
        verification = StudentVerification.objects.filter(user=request.user).first()
        serializer = StudentVerificationSerializer(
            verification,
            data=request.data,
            partial=bool(verification),
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, status="pending")
        return Response(serializer.data)


class CollegeModeHomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        verification = StudentVerification.objects.filter(user=request.user).first()
        status = verification.status if verification else "not_submitted"
        return Response({
            "verification_status": status,
            "sections": [
                {"id": "friends", "title": "Find friends", "description": "Meet verified students with shared interests."},
                {"id": "study", "title": "Study partner", "description": "Connect for focused study and exam preparation."},
                {"id": "events", "title": "Events & campus connections", "description": "Discover safe campus activities."},
            ],
        })
