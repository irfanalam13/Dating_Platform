from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.profiles.models.settings import ProfileSettings
from apps.profiles.serializers.settings_serializer import ProfileSettingsSerializer


class ProfileSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings = ProfileSettings.objects.get(user=request.user)
        serializer = ProfileSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings = ProfileSettings.objects.get(user=request.user)

        for field, value in request.data.items():
            setattr(settings, field, value)

        settings.save()
        serializer = ProfileSettingsSerializer(settings)
        return Response(serializer.data)
    
    