from datetime import timedelta
from django.utils.timezone import now
from profiles.models.profile_view import ProfileView


def delete_old_views():
    cutoff = now() - timedelta(days=30)
    ProfileView.objects.filter(created_at__lt=cutoff).delete()