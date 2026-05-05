from django.contrib import admin
from apps.profiles.models.profile import Profile, ProfileImage, Verification
from apps.preferences.models import  CulturalProfile

class CulturalProfileInline(admin.StackedInline):
    model = CulturalProfile
    extra = 0

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    inlines = [CulturalProfileInline]
    list_display = ["id", "full_name", "user", "is_active", "is_flagged", "created_at"]
    search_fields = ["full_name", "user__email"]
    list_filter = ["is_active", "is_flagged"]
    list_select_related = ["user"]

    actions = ["make_active", "make_inactive", "flag_profiles"]

    def make_active(self, request, queryset):
        queryset.update(is_active=True)

    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)

    def flag_profiles(self, request, queryset):
        queryset.update(is_flagged=True)


@admin.register(ProfileImage)
class ProfileImageAdmin(admin.ModelAdmin):
    list_display = ["id", "profile", "is_primary", "created_at"]
    list_filter = ["is_primary"]


@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = ["user", "status", "created_at"]
    list_filter = ["status"]

    actions = ["approve_users", "reject_users"]

    def approve_users(self, request, queryset):
        queryset.update(status="approved")

    def reject_users(self, request, queryset):
        queryset.update(status="rejected")

        