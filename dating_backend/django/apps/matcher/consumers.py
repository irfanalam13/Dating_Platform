# from apps.notification.services import send_notification

# send_notification(
#     user=receiver,
#     data={
#         "type": "match",
#         "title": "It's a Match ❤️",
#         "body": "You have a new match!",
#         "profile_id": sender_profile.id,
#     }
# )

from apps.accounts.models import User
from apps.profiles.models.profile import Profile
from apps.notification.services import send_notification

# 1. Identify the entities involved
# Assuming 'sender_profile' is the person who initiated the like/action
# and 'receiver' is the User object receiving the notification
sender_profile = Profile.objects.get(id=some_id)
receiver = User.objects.get(id=another_id)

# 2. Trigger the notification service
send_notification(
    user=receiver,
    data={
        "type": "match",
        "title": "It's a Match ❤️",
        "body": f"You and {sender_profile.display_name} have matched!",
        "profile_id": sender_profile.id,
        "image_url": sender_profile.avatar.url if sender_profile.avatar else None
    }
)
