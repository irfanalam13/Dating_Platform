from django.urls import path

from apps.profiles.views.profile_view import (
    ProfileView,
    ProfileDetailView,
    UploadImageView,
    DeleteImageView,
    UpdateLocationView,
    GeoAIRecommendationView,
    get_profile_by_username,
)
from .views import ProfileSettingsView

urlpatterns = [
    path("settings/", ProfileSettingsView.as_view(), name="profile-settings"),

]
