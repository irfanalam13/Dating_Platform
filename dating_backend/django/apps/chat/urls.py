from django.urls import path
from .views import (
    StartConversationView,
    ConversationListView,
    MessageListView,
    SendMessageView,
)

urlpatterns = [
    # 💬 Start a new conversation
    path("start/<int:profile_id>/", StartConversationView.as_view(), name="start-conversation"),

    # 📋 List all conversations of logged-in user
    path("", ConversationListView.as_view(), name="conversation-list"),

    # 📨 Get messages of a conversation
    path("<int:conversation_id>/messages/", MessageListView.as_view(), name="message-list"),

    # ✉️ Send a message
    path("send/", SendMessageView.as_view(), name="send-message"),
]