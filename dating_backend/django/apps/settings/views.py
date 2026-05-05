from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def update_settings(request):
    user = request.user  # make sure authentication is set

    user.username = request.data.get("username", user.username)
    user.email = request.data.get("email", user.email)

    password = request.data.get("password")
    if password:
        user.set_password(password)

    user.save()

    return Response({"message": "Updated successfully"})