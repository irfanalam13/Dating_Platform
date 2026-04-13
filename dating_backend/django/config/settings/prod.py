from .base import *

DEBUG = False
ALLOWED_HOSTS = ["your-domain.com"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "dating",
        "USER": "postgres",
        "PASSWORD": "password",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

SECURE_SSL_REDIRECT = True