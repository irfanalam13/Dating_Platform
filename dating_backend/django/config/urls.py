from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.accounts.views import CookieTokenRefreshView

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Dating App API",
      default_version='v1',
      description="API documentation",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
   authentication_classes=[]
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # ✅ Your API

    # ✅ Swagger
    re_path(r"^swagger/$", schema_view.with_ui("swagger", cache_timeout=0), name="swagger"),
    re_path(r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="redoc"),



    path("api/v1/auth/refresh/", CookieTokenRefreshView.as_view()),
    path("api/v1/auth/", include("apps.accounts.urls")),

]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)