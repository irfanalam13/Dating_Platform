from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)