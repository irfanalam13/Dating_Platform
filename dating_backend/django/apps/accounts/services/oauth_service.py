# # services/oauth_service.py

# from allauth.socialaccount.models import SocialAccount
# from django.contrib.auth import get_user_model

# User = get_user_model()

# def get_or_create_google_user(data):
#     email = data.get("email")
#     name = data.get("name")

#     user, _ = User.objects.get_or_create(email=email, defaults={
#         "full_name": name,
#         "is_verified": True
#     })

#     return user