import os
from pathlib import Path
import environ

env = environ.Env()

# Build paths inside the project: BASE_DIR resolves to /app inside the container
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Define possible locations for the .env file
possible_env_paths = [
    BASE_DIR / ".env",
    BASE_DIR.parent / ".env",
    BASE_DIR.parent.parent / ".env",
]

# Find the file if it exists
ENV_FILE = None
for path in possible_env_paths:
    if path.is_file():
        ENV_FILE = path
        break

if ENV_FILE:
    print(f"Loading .env file from: {ENV_FILE}")
    environ.Env.read_env(ENV_FILE)
else:
    print("No .env file found. Falling back to environment variables.")

# Safely load the variables
DB_NAME = env("DB_NAME", default="NOT_FOUND")


SECRET_KEY = env("SECRET_KEY", default="unsafe-secret-key") # type: ignore
DEBUG = env.bool("DEBUG", default=True)

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])
# 📦 APPS
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    "drf_yasg",
    "django.contrib.postgres",


    # Local
    "apps.accounts",
    "apps.chat",
    "apps.collegeMode",
    "apps.core",
    "apps.matcher",
    "apps.preferences",
    "apps.ai",
    "apps.block",
    "apps.notification",
    "apps.report",
    "apps.safety",
    "apps.verify",
    "apps.privacy",
    "apps.analytics",
    "apps.engagement",
    "apps.moderation",
    "apps.recommendation",
    "apps.settings",

    "apps.profiles.apps.ProfilesConfig",

]

# ⚙️ MIDDLEWARE
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",

]

# 🔥 CUSTOM USER
AUTH_USER_MODEL = "accounts.User"

# 🔥 AUTH BACKEND (IMPORTANT)


# 🌐 URL
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# 🎨 TEMPLATES
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env.int("DB_PORT"),
    }
}

# 🔑 PASSWORD VALIDATION
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# 🌍 I18N
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kathmandu"
USE_I18N = True
USE_TZ = True

# 📁 STATIC / MEDIA
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# 🔗 DRF
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "apps.accounts.authentication.CookieJWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",  # 🔥 keep secure

    ),
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",  # ✅ IMPORTANT


    ],
        "DEFAULT_THROTTLE_RATES": {
        "user": "100/min",
    },

}


# 🔑 JWT
SIMPLE_JWT = {
    "AUTH_COOKIE": "access",
    "AUTH_COOKIE_REFRESH": "refresh",
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SECURE": True,   # HTTPS only
    "AUTH_COOKIE_SAMESITE": "None",

    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

secure=True

SWAGGER_SETTINGS = {
    "SECURITY_DEFINITIONS": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Enter: Bearer <your_token>",
        }
    }
}
# 🌐 CORS (DEV)
CORS_ALLOW_CREDENTIALS = True


CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
]

SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False  # must be False for frontend access

SESSION_COOKIE_SAMESITE = "Lax"  # or "None" if cross-domain
CSRF_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
# CSRF_COOKIE_SAMESITE = "Lax"

SESSION_COOKIE_SECURE = False  # True in production (HTTPS)
CSRF_COOKIE_SECURE = not DEBUG

# CSRF_COOKIE_SECURE = False

AUTHENTICATION_BACKENDS = [
    "apps.accounts.backends.PhoneOrEmailBackend",
]


ASGI_APPLICATION = "config.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

LOGIN_URL = "/api/v1/auth/login/"

