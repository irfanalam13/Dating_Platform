# matches/urls.py

from django.urls import path
from .views import *

urlpatterns = [
    path("recommendations/", RecommendationView.as_view()),

    path("send/<int:profile_id>/", SendMatchView.as_view()),
    path("accept/<int:match_id>/", AcceptMatchView.as_view()),
    path("reject/<int:match_id>/", RejectMatchView.as_view()),

    path("sent/", SentMatchesView.as_view()),
    path("received/", ReceivedMatchesView.as_view()),
    path("accepted/", AcceptedMatchesView.as_view()),
]