from .base import *
from .base import env  # explicit import for Pylance
from django.conf import settings

# ✅ DEBUG
DEBUG: bool = env.bool("DEBUG", default=True)

# ✅ ALLOWED HOSTS (safe typing)
DEBUG = env.bool("DEBUG", default=False)

if DEBUG:
    ALLOWED_HOSTS = ["*"]
else:
    # Force specific domains in production
    ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["dating-backend.onrender.com"])
# ✅ DATABASE

DATABASES: dict = {
    "default": {
        # "ENGINE": "django.contrib.gis.db.backends.postgis",
        "ENGINE": "django.db.backends.postgresql",

        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env.int("DB_PORT"),
    }
}

