from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwner(BasePermission):
    """
    Custom permission:
    Allows users to access only their own data
    """

    def has_object_permission(self, request, view, obj):
        return obj == request.user


class IsOwnerOrReadOnly(BasePermission):
    """
    Read for everyone, write only for owner
    """

    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS
        if request.method in SAFE_METHODS:
            return True

        # Allow write only if owner
        return obj == request.user


class IsProfileOwner(BasePermission):
    """
    Specific for Profile model (user.profile)
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class AllowAnyForAuth(BasePermission):
    """
    Allow anyone for login/register only
    """

    def has_permission(self, request, view):
        return True