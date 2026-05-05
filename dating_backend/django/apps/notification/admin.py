from django.contrib import admin
from django.contrib.auth import get_user_model
from django import forms

from .models import Notification
from .services import send_notification

User = get_user_model()


# ===============================
# 🔧 Custom Form for Admin Action
# ===============================
class NotificationForm(forms.Form):
    title = forms.CharField(max_length=255)
    message = forms.CharField(widget=forms.Textarea)
    notification_type = forms.ChoiceField(
        choices=[
            ("system", "System"),
            ("match", "Match Alert"),
            ("romantic", "Romantic Reminder ❤️"),
        ]
    )
    send_to = forms.ChoiceField(
        choices=[
            ("all", "All Users"),
            ("active", "Active Users"),
            ("staff", "Staff Users"),
        ]
    )


# ===============================
# 📊 Notification Admin
# ===============================
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "notification_type",
        "title",
        "is_read",
        "created_at",
    ]
    list_filter = ["notification_type", "is_read"]
    search_fields = ["title", "user__email"]
    ordering = ["-created_at"]

    actions = ["send_custom_notification"]


    # ===============================
    # 🔥 Admin Action
    # ===============================
    @admin.action(description="Send Push Notification")
    def send_custom_notification(self, request, queryset):
        """
        Send notification based on admin input
        """

        # Example: simple broadcast (can be improved with form UI)
        users = User.objects.all()

        for user in users:
            send_notification(
                user=user,
                data={
                    "type": "system",
                    "title": "🔥 Special Update",
                    "body": "Check out new matches today!"
                }
            )

        self.message_user(request, "Notification sent to all users ✅")
        