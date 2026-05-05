from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import TokenError


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # 🔹 1. Try cookie first
        raw_token = request.COOKIES.get("access")

        # 🔹 2. Fallback to Authorization header (for Postman / dev)
        if not raw_token:
            header = self.get_header(request)
            if header:
                raw_token = self.get_raw_token(header)

        # 🔹 3. No token → return None (DRF will handle permission)
        if not raw_token:
            return None

        try:
            # 🔹 4. Validate token
            validated_token = self.get_validated_token(raw_token)

            # 🔹 5. Get user
            user = self.get_user(validated_token)

            # 🔹 6. Check user status
            if not user or not user.is_active:
                raise AuthenticationFailed("User inactive or deleted")

            return (user, validated_token)

        except TokenError:
            # 🔥 More accurate error
            raise AuthenticationFailed("Token expired or invalid")

        except AuthenticationFailed:
            raise

        except Exception:
            # 🔥 Catch unexpected errors safely
            raise AuthenticationFailed("Authentication failed")