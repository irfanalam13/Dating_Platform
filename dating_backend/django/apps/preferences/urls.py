from django.urls import path
from .views import *

urlpatterns = [
    path("create/", CreateProfileView.as_view()),
    path("me/", MyProfileView.as_view()),
    path("update/", UpdateProfileView.as_view()),
    path("<int:id>/", PublicProfileView.as_view()),


    path("cultural/", CulturalProfileView.as_view()),
    path("cultural/update/", UpdateCulturalProfileView.as_view()),

    path("preferences/", PreferencesView.as_view()),
    path("preferences/update/", UpdatePreferencesView.as_view()),
]