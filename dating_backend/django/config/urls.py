from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.accounts.views import CookieTokenRefreshView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.http import HttpResponse

def home(request):
    return HttpResponse("Backend is running 🚀")

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
    path("", home),
    path("admin/", admin.site.urls),
    re_path(r"^swagger/$", schema_view.with_ui("swagger", cache_timeout=0), name="swagger"),
    re_path(r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="redoc"),
    path("api/v1/auth/refresh/", CookieTokenRefreshView.as_view()),
    path("api/v1/auth/", include("apps.accounts.urls")),
   #  path("api/v1/ai/", include("apps.ai.urls")),
    path("api/v1/block/", include("apps.block.urls")),
    path("api/v1/core/", include("apps.core.urls")),
    path("api/v1/chat/", include("apps.chat.urls")),
    path("api/v1/college-mode/", include("apps.collegeMode.urls")),
    path("api/v1/matcher/", include("apps.matcher.urls")),
    path("api/v1/notification/", include("apps.notification.urls")),
    path("api/v1/preference/", include("apps.preferences.urls")),
    path("api/v1/privacy/", include("apps.privacy.urls")),
    path("api/v1/recommendations/", include("apps.recommendation.urls")),    
    path("api/v1/profile/", include("apps.profiles.urls")),
    path("api/v1/reports/", include("apps.report.urls")),
    path("api/v1/safety/", include("apps.safety.urls")),
    path("api/v1/verify/", include("apps.verify.urls")),
    path("api/v1/analytics/", include("apps.analytics.urls")),
    path("api/v1/engagement/", include("apps.engagement.urls")),
    path("api/v1/moderation/", include("apps.moderation.urls")),
    path("api/v1/subscription/", include("apps.subscription.urls")),
    path("api/v1/verify/", include("apps.verify.urls")),
    path("api/v1/setting/", include("apps.settings.urls")),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
