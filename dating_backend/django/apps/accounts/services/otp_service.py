# # services/otp_service.py

# import random
# from django.core.cache import cache

# def generate_otp(phone):
#     otp = str(random.randint(100000, 999999))
#     cache.set(f"otp:{phone}", otp, timeout=300)  # 5 min
#     return otp

# def verify_otp(phone, otp):
#     stored = cache.get(f"otp:{phone}")
#     return stored == otp