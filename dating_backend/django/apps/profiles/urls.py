from django.urls import path
from .views import GetProfileView, UpdateProfileView, UploadImageView, GetImagesView

urlpatterns = [
    path("profile/", GetProfileView.as_view()),
    path("profile/update/", UpdateProfileView.as_view()),
    path("profile/upload-image/", UploadImageView.as_view()),
    path("profile/images/", GetImagesView.as_view()),
]
