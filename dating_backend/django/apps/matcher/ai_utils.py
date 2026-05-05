import numpy as np


def safe_len(value):
    return len(value) if value else 0


def build_profile_vector(profile):
    """
    Returns a fixed-length numeric vector.
    NEVER crashes on missing data.
    """

    vector = []

    # 🎯 Age (normalized)
    age = profile.age() or 0
    vector.append(age / 100)

    # 👤 Gender
    gender = getattr(profile, "gender", None)
    vector.append(1 if gender == "male" else 0)

    # 📍 City (length proxy)
    city = getattr(profile, "city", "") or ""
    vector.append(safe_len(city) / 100)

    # 🧠 Extra fields (future-safe)
    extra = profile.extra_data or {}
    vector.append(len(extra) / 10)

    return vector


def cosine_similarity(vec1, vec2):
    v1 = np.array(vec1, dtype=float)
    v2 = np.array(vec2, dtype=float)

    if v1.size == 0 or v2.size == 0:
        return 0.0

    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)

    if norm1 == 0 or norm2 == 0:
        return 0.0

    return float(np.dot(v1, v2) / (norm1 * norm2))
