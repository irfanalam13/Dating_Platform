from .ai_detection import detect_spam, detect_abuse, detect_fake_profile
from apps.safety.models import SafetyScore


def update_user_score(user, increment):
    safety, _ = SafetyScore.objects.get_or_create(user=user)
    safety.score += increment

    # 🚨 Auto rules
    if safety.score >= 10:
        safety.is_flagged = True

    if safety.score >= 20:
        safety.is_banned = True
        user.is_active = False
        user.save()

    safety.save()


def analyze_message(user, message: str):
    spam_score = detect_spam(message)
    abuse_score = detect_abuse(message)

    total = spam_score + abuse_score

    if total > 0:
        update_user_score(user, total)


def analyze_profile(user, profile):
    fake_score = detect_fake_profile(profile)

    if fake_score > 0:
        update_user_score(user, fake_score)
        