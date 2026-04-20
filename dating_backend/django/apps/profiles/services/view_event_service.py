# profiles/services/view_event_service.py

from django.core.cache import cache


def push_view_event(viewer_id, viewed_id):
    key = "profile_view_events"

    cache.lpush(key, f"{viewer_id}:{viewed_id}")