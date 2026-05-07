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

urlpatterns = [
    # 🔹 Self Profile
    path("me/", ProfileView.as_view(), name="my-profile"),
    path("<int:user_id>/", ProfileDetailView.as_view(), name="profile-detail"),

    # 🔹 Public Profiles
    # 🔹 Media
    path("upload-image/", UploadImageView.as_view(), name="upload-image"),
    path("delete-image/<int:id>/", DeleteImageView.as_view(), name="delete-image"),

    # 🔹 Location
    path("location/", UpdateLocationView.as_view(), name="update-location"),

    # 🔹 AI Matching
    path("recommendations/", GeoAIRecommendationView.as_view(), name="ai-recommendations"),


]
