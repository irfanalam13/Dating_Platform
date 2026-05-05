from django.contrib import admin
from .models import Religion, Caste, Gotra, CulturalProfile

@admin.register(Religion)
class ReligionAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)

@admin.register(Caste)
class CasteAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "religion")
    list_filter = ("religion",)
    search_fields = ("name",)

@admin.register(Gotra)
class GotraAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "caste")
    list_filter = ("caste",)
    search_fields = ("name",)

@admin.register(CulturalProfile)
class CulturalProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "profile",
        "religion",
        "caste",
        "gotra",
        "mother_tongue",
        "education",
        "occupation",
        "is_visible"
    )

    list_filter = ("religion", "caste", "gotra", "is_visible")

    search_fields = ("profile__user__username",)