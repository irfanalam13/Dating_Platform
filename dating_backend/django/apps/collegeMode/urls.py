from django.urls import path
from .views import CollegeModeHomeView, StudentVerificationView

urlpatterns = [
    path("", CollegeModeHomeView.as_view(), name="college-mode-home"),
    path("verification/", StudentVerificationView.as_view(), name="student-verification"),
]
