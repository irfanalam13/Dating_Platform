from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, CookieTokenRefreshView

router = DefaultRouter()
router.register("", AuthViewSet, basename="auth")

urlpatterns = [
    path("auth/refresh/", CookieTokenRefreshView.as_view()),
]

urlpatterns += router.urls