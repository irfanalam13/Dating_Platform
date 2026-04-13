from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ProfileImage
from .serializers import ProfileSerializer, ProfileImageSerializer


class GetProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user.profile)
        return Response(serializer.data)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        profile.check_profile_complete()

        return Response(serializer.data)


class UploadImageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = request.user.profile
        image = request.FILES.get("image")

        obj = ProfileImage.objects.create(profile=profile, image=image)

        profile.check_profile_complete()

        return Response(ProfileImageSerializer(obj).data)


class GetImagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        images = request.user.profile.images.all()
        return Response(ProfileImageSerializer(images, many=True).data)