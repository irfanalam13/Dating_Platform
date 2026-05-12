import os
from pathlib import Path
import environ
import secrets

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

# -------------------------------------------------------------
# ⚙️ CORE SETTINGS
# -------------------------------------------------------------
SECRET_KEY = env("SECRET_KEY", default="unsafe-secret-key") # type: ignore
DEBUG = env.bool("DEBUG", default=True)

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])

# 🔥 DYNAMIC ENVIRONMENT FLAG
# If DEBUG is False (Production), enforce HTTPS and Cross-Domain security
IS_SECURE_ENV = not DEBUG

# -------------------------------------------------------------
# 📦 APPS
# -------------------------------------------------------------
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

# -------------------------------------------------------------
# ⚙️ MIDDLEWARE
# -------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# -------------------------------------------------------------
# 🌐 URLS & WSGI/ASGI
# -------------------------------------------------------------
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# -------------------------------------------------------------
# 🔥 CUSTOM USER & AUTH
# -------------------------------------------------------------
AUTH_USER_MODEL = "accounts.User"
AUTHENTICATION_BACKENDS = [
    "apps.accounts.backends.PhoneOrEmailBackend",
]
LOGIN_URL = "/api/v1/auth/login/"

# -------------------------------------------------------------
# 🎨 TEMPLATES
# -------------------------------------------------------------
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

# -------------------------------------------------------------
# 🗄️ DATABASE
# -------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME", default="NOT_FOUND"),
        "USER": env("DB_USER", default=""),
        "PASSWORD": env("DB_PASSWORD", default=""),
        "HOST": env("DB_HOST", default=""),
        "PORT": env.int("DB_PORT", default=5432),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -------------------------------------------------------------
# 🌍 I18N
# -------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kathmandu"
USE_I18N = True
USE_TZ = True

# -------------------------------------------------------------
# 📁 STATIC / MEDIA
# -------------------------------------------------------------

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# -------------------------------------------------------------
# 🔗 REST FRAMEWORK
# -------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "apps.accounts.authentication.CookieJWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",  
    ),
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",  
    ],
    "DEFAULT_THROTTLE_RATES": {
        "user": "100/min",
    },
}

# -------------------------------------------------------------
# 🔑 JWT COOKIE SETTINGS (DYNAMIC)
# -------------------------------------------------------------
SIMPLE_JWT = {
    "AUTH_COOKIE": "access",
    "AUTH_COOKIE_REFRESH": "refresh",
    "AUTH_COOKIE_HTTP_ONLY": True,
    
    # ✅ DYNAMIC SECURITY: False locally, True in production
    "AUTH_COOKIE_SECURE": IS_SECURE_ENV, 
    "AUTH_COOKIE_SAMESITE": "None" if IS_SECURE_ENV else "Lax",

    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# -------------------------------------------------------------
# 🌐 CORS & BROWSER SECURITY (DYNAMIC)
# -------------------------------------------------------------

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # NOT 127.0.0.1
    "https://dating-platform-frontend.vercel.app",
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "https://dating-platform-frontend.vercel.app",

]

# ✅ DYNAMIC DJANGO COOKIES
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False  # Must be False for frontend access

SESSION_COOKIE_SECURE = IS_SECURE_ENV 
CSRF_COOKIE_SECURE = IS_SECURE_ENV

SESSION_COOKIE_SAMESITE = "None" if IS_SECURE_ENV else "Lax"
CSRF_COOKIE_SAMESITE = "None" if IS_SECURE_ENV else "Lax"

SESSION_COOKIE_NAME = "access"

# -------------------------------------------------------------
# 📡 CHANNELS / WEBSOCKETS
# -------------------------------------------------------------
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

# -------------------------------------------------------------
# 📖 SWAGGER
# -------------------------------------------------------------
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
