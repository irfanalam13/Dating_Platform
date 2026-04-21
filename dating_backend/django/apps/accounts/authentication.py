from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # 1. Try cookie first
        raw_token = request.COOKIES.get("access")

        # 2. Fallback to Authorization header
        if raw_token is None:
            header = self.get_header(request)
            if header is not None:
                raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)

            if user is None or not user.is_active:
                raise AuthenticationFailed("User inactive or not found")

            return (user, validated_token)

        except Exception:
            raise AuthenticationFailed("Invalid or expired token")


