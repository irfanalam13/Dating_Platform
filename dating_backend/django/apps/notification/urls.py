from django.urls import path
from .views import (
    NotificationListView,
    MarkAsReadView,
)

urlpatterns = [
    # 🔔 List all notifications for logged-in user
    path("", NotificationListView.as_view(), name="notification-list"),

    # ✅ Mark a notification as read
    path("<int:id>/read/", MarkAsReadView.as_view(), name="mark-as-read"),
]
