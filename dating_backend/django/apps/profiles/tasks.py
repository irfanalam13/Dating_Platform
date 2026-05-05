# profiles/tasks.py

from celery import shared_task
from apps.profiles.models.profile_view import ProfileView


@shared_task
def process_view_events():
    import redis

    r = redis.Redis()
    key = "profile_view_events"

    while True:
        event = r.rpop(key)
        if not event:
            break

        viewer_id, viewed_id = map(int, event.decode().split(":"))

        ProfileView.objects.update_or_create(
            viewer_id=viewer_id,
            viewed_id=viewed_id
        )