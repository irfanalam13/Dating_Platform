# safety/urls.py

from django.urls import path
from .views import PrivacyView

urlpatterns = [
    # Privacy
    path("privacy/", PrivacyView.as_view()),
    path("privacy/update/", PrivacyView.as_view()),


]