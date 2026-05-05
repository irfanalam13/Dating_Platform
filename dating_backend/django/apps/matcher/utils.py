from apps.profiles.models.profile import Profile
from apps.preferences.models import Preferences, CulturalProfile


def calculate_match_score(user, target_profile):
    try:
        pref = Preferences.objects.get(user=user)
        user_profile = Profile.objects.get(user=user)
    except Preferences.DoesNotExist:
        return 0
    except Profile.DoesNotExist:
        return 0

    score = 0

    # 🎯 1. Age Score (30)
    age = target_profile.age() or 0
    if pref.min_age and pref.max_age and pref.min_age <= age <= pref.max_age:
        score += 30

    # 📍 2. Location Score (25)
    if pref.city and target_profile.city:
        if pref.city.lower() in target_profile.city.lower():
            score += 25

    # ❤️ 3. Gender Preference (20)
    if pref.preferred_gender == "any" or target_profile.gender == pref.preferred_gender:
        score += 20

    # 🌏 4. Cultural Match (15)
    try:
        user_culture = CulturalProfile.objects.get(profile=user_profile)
        target_culture = CulturalProfile.objects.get(profile=target_profile)

        if user_culture.religion == target_culture.religion:
            score += 10

        if user_culture.mother_tongue == target_culture.mother_tongue:
            score += 5

    except CulturalProfile.DoesNotExist:
        pass

    # ⚡ 5. Activity Boost (10)
    if hasattr(target_profile, "last_active") and target_profile.last_active:
        score += 10

    return score
