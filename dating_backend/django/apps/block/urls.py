# safety/urls.py

from django.urls import path
from .views import *

urlpatterns = [
    # Privacy
    # Block
    path("block/<int:profile_id>/", BlockUserView.as_view()),
    path("block/list/", BlockListView.as_view()),
    path("block/<int:profile_id>/", UnblockUserView.as_view()),

    # Report

]