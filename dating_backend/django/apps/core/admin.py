from django.contrib import admin


class BaseAdmin(admin.ModelAdmin):
    list_per_page = 25
    ordering = ["-id"]

    def get_search_fields(self, request):
        return ["id"]

    def has_delete_permission(self, request, obj=None):
        # Only superuser can delete
        return request.user.is_superuser
    