from django.utils.timezone import now
from profiles.models.profile_view import ProfileView


def track_profile_view(viewer, viewed):
    from profiles.models.settings import ProfileSettings

    settings = ProfileSettings.objects.only(
        "anonymous_viewing"
    ).get(user=viewer)

    if settings.anonymous_viewing:
        return  # don't track

    if viewer == viewed:
        return

    ProfileView.objects.update_or_create(
        viewer=viewer,
        viewed=viewed,
        defaults={"created_at": now()}
    )
    

def track_view_realtime(viewer_id, viewed_id):
    import redis
    r = redis.Redis()

    key = f"profile_recent:{viewed_id}"

    r.lpush(key, viewer_id)
    r.ltrim(key, 0, 100)  # last 100 viewers
    
    
def get_recent_viewers(viewed_id):
    import redis
    r = redis.Redis()

    key = f"profile_recent:{viewed_id}"
    return r.lrange(key, 0, 20)