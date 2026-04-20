import redis

r = redis.Redis()

def track_profile_view_fast(viewer_id, viewed_id):
    key = f"profile_views:{viewed_id}"

    r.lpush(key, viewer_id)
    r.ltrim(key, 0, 50)  # keep last 50