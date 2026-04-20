from .base import *
from .base import env

DEBUG: bool = False

ALLOWED_HOSTS: list[str] = env.list("ALLOWED_HOSTS")

DATABASES: dict = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env.int("DB_PORT"),
    }
}

SECURE_SSL_REDIRECT: bool = True