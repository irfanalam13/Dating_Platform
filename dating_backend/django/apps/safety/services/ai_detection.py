import re


SPAM_KEYWORDS = ["buy now", "click here", "free money", "telegram", "whatsapp"]
ABUSE_KEYWORDS = ["hate", "kill", "stupid", "idiot"]


def detect_spam(text: str) -> float:
    score = 0
    text_lower = text.lower()

    for word in SPAM_KEYWORDS:
        if word in text_lower:
            score += 2

    # links = suspicious
    if re.search(r"http[s]?://", text_lower):
        score += 2

    return score


def detect_abuse(text: str) -> float:
    score = 0
    text_lower = text.lower()

    for word in ABUSE_KEYWORDS:
        if word in text_lower:
            score += 3

    return score


def detect_fake_profile(profile) -> float:
    score = 0

    if not profile.bio:
        score += 1

    if not profile.profile_image:
        score += 2

    if len(profile.bio or "") < 10:
        score += 1

    return score