from rest_framework.response import Response

def api_response(success, message, code, data=None, status_code=200):
    return Response({
        "success": success,
        "message": message,
        "code": code,
        "data": data or {}
    }, status=status_code)