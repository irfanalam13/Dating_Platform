send_notification(
    user=receiver,
    data={
        "type": "match",
        "title": "It's a Match ❤️",
        "body": "You have a new match!",
        "profile_id": sender_profile.id,
    }
)