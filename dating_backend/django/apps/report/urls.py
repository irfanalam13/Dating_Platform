# safety/urls.py

from django.urls import path
from .views import *

urlpatterns = [

    # Report
    path("report/<int:profile_id>/", ReportUserView.as_view()),
    path("report/my/", MyReportsView.as_view()),
]