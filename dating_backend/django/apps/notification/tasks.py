from celery import shared_task
from apps.notification.services import send_notification


@shared_task
def send_message_notification(user_id, message, convo_id):
    from django.contrib.auth import get_user_model
    User = get_user_model()

    user = User.objects.get(id=user_id)

    send_notification(
        user=user,
        data={
            "type": "message",
            "title": "New Message 💬",
            "body": message,
            "conversation_id": convo_id,
        }
    )