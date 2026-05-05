from django.contrib import admin
from .models import SafetyScore


@admin.register(SafetyScore)
class SafetyScoreAdmin(admin.ModelAdmin):
    list_display = ["user", "score", "is_flagged", "is_banned"]
    search_fields = ["user__email"]
    list_filter = ["is_flagged", "is_banned"]

    actions = ["reset_score"]

    def reset_score(self, request, queryset):
        queryset.update(score=0, is_flagged=False, is_banned=False)