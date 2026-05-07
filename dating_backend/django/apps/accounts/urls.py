from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, CookieTokenRefreshView, CSRFView

router = DefaultRouter()
router.register(r"", AuthViewSet, basename="auth")  
# IMPORTANT: empty string, NOT "auth"

urlpatterns = [
    path("", include(router.urls)),
    path("refresh/", CookieTokenRefreshView.as_view()),
    path("csrf/", CSRFView.as_view()),
]