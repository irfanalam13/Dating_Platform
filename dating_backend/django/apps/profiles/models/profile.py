from django.db import models
from django.contrib.auth import get_user_model
# from pgvector.django import VectorField
# from django.contrib.gis.db import models as gis_models
# from django.contrib.gis.db.models import indexes as gis_indexes
# from django.contrib.gis.db.models import GistIndex
from django.contrib.postgres.indexes import GistIndex
from datetime import date
from apps.preferences.models import Religion, Caste, Gotra

User = get_user_model()

class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    is_flagged = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, db_index=True)
    is_complete = models.BooleanField(default=False)
    # Connect your preference tables 👇
    religion = models.ForeignKey(Religion, on_delete=models.SET_NULL, null=True)
    caste = models.ForeignKey(Caste, on_delete=models.SET_NULL, null=True)
    gotra = models.ForeignKey(Gotra, on_delete=models.SET_NULL, null=True)

    gan = models.CharField(max_length=100, blank=True)
    horoscope = models.CharField(max_length=100, blank=True)

    hobbies = models.TextField(blank=True)
    preferences = models.TextField(blank=True)
    relationship_intent = models.CharField(max_length=40, blank=True)
    education = models.CharField(max_length=120, blank=True)
    career = models.CharField(max_length=120, blank=True)
    values = models.TextField(blank=True)
    ethnicity = models.CharField(max_length=100, blank=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(blank=True)

    city = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    profile_image = models.ImageField(upload_to="profiles/", null=True, blank=True)

    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        null=True,
        blank=True
    )

    date_of_birth = models.DateField(null=True, blank=True)

    last_active = models.DateTimeField(null=True, blank=True)

    extra_data = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_active"]),
        ]

    def age(self):
        if not self.date_of_birth:
            return 0

        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )

    def __str__(self):
        return getattr(self.user, "email", "Profile")

class ProfileImage(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="images",
        db_index=True
    )

    image = models.ImageField(upload_to="profiles/")
    is_primary = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["profile"],
                condition=models.Q(is_primary=True),
                name="unique_primary_image"
            )
        ]


class ProfileVector(models.Model):
    profile = models.OneToOneField(
        Profile,
        on_delete=models.CASCADE,
        related_name="vector",
        db_index=True
    )

    # 🔥 AI embedding
    # embedding = VectorField(dimensions=384)
    embedding = models.JSONField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)


class Verification(models.Model):
    STATUS = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        db_index=True
    )

    document = models.ImageField(upload_to="verification/")
    status = models.CharField(max_length=20, choices=STATUS, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


