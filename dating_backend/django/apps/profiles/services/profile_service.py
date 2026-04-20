from profiles.models.profile import Profile


def update_profile(user, data):
    profile = Profile.objects.get(user=user)

    for field, value in data.items():
        setattr(profile, field, value)

    profile.save(update_fields=data.keys())
    return profile