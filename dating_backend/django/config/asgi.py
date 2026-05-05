import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# set settings module FIRST
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# import websocket routes AFTER settings
from apps.chat.routing import websocket_urlpatterns as chat_ws
from apps.notification.routing import websocket_urlpatterns as notif_ws

# combine all websocket routes
websocket_patterns = chat_ws + notif_ws

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": AuthMiddlewareStack(   # 🔥 important for user auth
        URLRouter(websocket_patterns)
    ),
})