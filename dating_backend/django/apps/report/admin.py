from django.contrib import admin
from django.utils import timezone
from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "reporter",
        "reported",
        "reason",
        "status",
        "created_at",
    ]

    list_filter = ["status", "reason"]
    search_fields = ["reporter__email", "reported__email"]
    ordering = ["-created_at"]

    actions = ["mark_reviewed", "ban_user", "reject_report"]

    # ✅ Mark reviewed
    def mark_reviewed(self, request, queryset):
        queryset.update(status="reviewed", reviewed_at=timezone.now())

    mark_reviewed.short_description = "Mark selected reports as reviewed" # type: ignore

    # 🚨 Ban user (Tinder-like action)
    def ban_user(self, request, queryset):
        for report in queryset:
            user = report.reported
            user.is_active = False
            user.save()

            report.status = "action_taken"
            report.reviewed_at = timezone.now()
            report.save()

    ban_user.short_description = "Ban reported users" # type: ignore

    # ❌ Reject report
    def reject_report(self, request, queryset):
        queryset.update(status="rejected", reviewed_at=timezone.now())

    reject_report.short_description = "Reject reports" # type: ignore