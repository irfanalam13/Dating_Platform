from django.core.cache import cache

MAX_ATTEMPTS = 5
BLOCK_TIME = 300  # seconds

def is_blocked(ip):
    return cache.get(f"block_{ip}") is True


def record_failure(ip):
    key = f"fail_{ip}"
    attempts = cache.get(key, 0) + 1
    cache.set(key, attempts, timeout=BLOCK_TIME)

    if attempts >= MAX_ATTEMPTS:
        cache.set(f"block_{ip}", True, timeout=BLOCK_TIME)


def reset_attempts(ip):
    cache.delete(f"fail_{ip}")