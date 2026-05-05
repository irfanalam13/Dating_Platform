from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import PrivacySerializer
from apps.privacy.models import PrivacySetting

class PrivacyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        obj, _ = PrivacySetting.objects.get_or_create(user=request.user)
        serializer = PrivacySerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj, _ = PrivacySetting.objects.get_or_create(user=request.user)

        serializer = PrivacySerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    

