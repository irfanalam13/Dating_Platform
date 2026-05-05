# accounts/admin.py

from django.contrib import admin
from django.contrib.auth import get_user_model
from apps.core.admin import BaseAdmin

User = get_user_model()


# 🔥 Ensure no duplicate registration
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass


@admin.register(User)
class UserAdmin(BaseAdmin):
    list_display = ["id", "email", "is_active", "is_staff", "date_joined"]
    search_fields = ["email"]
    list_filter = ["is_active", "is_staff"]

    actions = ["activate_users", "deactivate_users"]

    def activate_users(self, request, queryset):
        queryset.update(is_active=True)

    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)


        