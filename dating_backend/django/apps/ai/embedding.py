from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(profile):
    text = f"""
    Name: {profile.full_name}
    Bio: {profile.bio}
    City: {profile.city}
    Gender: {profile.gender}
    """

    embedding = model.encode(text)

    return embedding.tolist()