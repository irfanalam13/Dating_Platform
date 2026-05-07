from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ProfileSettings
from .serializers import ProfileSettingsSerializer


class ProfileSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = ProfileSettings.objects.get_or_create(user=request.user)
        serializer = ProfileSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings, _ = ProfileSettings.objects.get_or_create(user=request.user)
        serializer = ProfileSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        serializer = ProfileSettingsSerializer(settings)
        return Response(serializer.data)
    
    
