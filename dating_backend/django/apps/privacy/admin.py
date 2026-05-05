from django.contrib import admin
from .models import PrivacySetting


@admin.register(PrivacySetting)
class PrivacySettingAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "allow_messages_from",
        "is_profile_public",
        "updated_at",
    ]
    search_fields = ["user__email"]
    list_filter = ["allow_messages_from", "is_profile_public"]
    ordering = ["-updated_at"]

    