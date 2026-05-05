from django.urls import path
from .views import update_settings

urlpatterns = [
    path('settings/', update_settings),
]
