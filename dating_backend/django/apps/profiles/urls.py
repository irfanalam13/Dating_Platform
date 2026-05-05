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
from apps.profiles.views.settings_view import ProfileSettingsView

urlpatterns = [
    # 🔹 Self Profile
    path("me/", ProfileView.as_view(), name="my-profile"),

    # 🔹 Public Profiles
    path("user/<int:user_id>/", ProfileDetailView.as_view(), name="profile-detail"),
    path("username/<str:username>/", get_profile_by_username, name="profile-by-username"),

    # 🔹 Settings
    path("settings/", ProfileSettingsView.as_view(), name="profile-settings"),

    # 🔹 Media
    path("upload-image/", UploadImageView.as_view(), name="upload-image"),
    path("delete-image/<int:id>/", DeleteImageView.as_view(), name="delete-image"),

    # 🔹 Location
    path("location/", UpdateLocationView.as_view(), name="update-location"),

    # 🔹 AI Matching
    path("recommendations/", GeoAIRecommendationView.as_view(), name="ai-recommendations"),


]
