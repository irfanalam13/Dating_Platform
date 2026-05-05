from django.urls import path
from .views import PrivacyView

urlpatterns = [
    # 🔐 Get / Update user privacy settings
    path("", PrivacyView.as_view(), name="privacy-settings"),
]