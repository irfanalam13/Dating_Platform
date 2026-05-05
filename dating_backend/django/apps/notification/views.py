from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class MarkAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        notification = get_object_or_404(
            Notification, id=id, user=request.user
        )

        notification.is_read = True
        notification.save()

        return Response({"message": "Marked as read"})
    
    