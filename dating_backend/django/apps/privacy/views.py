from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PrivacySetting
from .serializers import PrivacySettingSerializer


class PrivacyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        privacy, _ = PrivacySetting.objects.get_or_create(user=request.user)
        serializer = PrivacySettingSerializer(privacy)
        return Response(serializer.data)

    def patch(self, request):
        privacy, _ = PrivacySetting.objects.get_or_create(user=request.user)
        serializer = PrivacySettingSerializer(privacy, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    