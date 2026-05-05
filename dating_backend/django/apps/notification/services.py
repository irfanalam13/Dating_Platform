from .models import Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def send_notification(user, data):
    # Save to DB
    notification = Notification.objects.create(
        user=user,
        notification_type=data.get("type"),
        title=data.get("title"),
        body=data.get("body", ""),
        conversation_id=data.get("conversation_id"),
        profile_id=data.get("profile_id"),
    )

    # Send real-time via WebSocket
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"user_{user.id}",
        {
            "type": "notify",
            "data": {
                "id": notification.id,
                "title": notification.title,
                "body": notification.body,
                "type": notification.notification_type,
            },
        }
    )

    return notification


