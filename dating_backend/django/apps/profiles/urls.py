from django.urls import path
from profiles.views.profile_view import ProfileView
from profiles.views.settings_view import ProfileSettingsView

urlpatterns = [
    path("me/", ProfileView.as_view()),
    path("settings/", ProfileSettingsView.as_view()),
]