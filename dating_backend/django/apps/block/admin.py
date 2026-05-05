from django.contrib import admin
from .models import Block

@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ["id", "blocker", "blocked", "created_at"]
    search_fields = ["blocker__email", "blocked__email"]
    