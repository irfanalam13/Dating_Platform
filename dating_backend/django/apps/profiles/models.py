from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # Basic Info
    bio = models.TextField(blank=True)
    age = models.IntegerField(null=True, blank=True)

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)

    location = models.CharField(max_length=255, blank=True)

    # Dating Preferences
    interested_in = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True
    )

    # Lifestyle
    SMOKING_CHOICES = (
        ("no", "Non-smoker"),
        ("occasionally", "Occasionally"),
        ("yes", "Smoker"),
    )
    smoking = models.CharField(max_length=20, choices=SMOKING_CHOICES, blank=True)

    DRINKING_CHOICES = (
        ("no", "No"),
        ("socially", "Socially"),
        ("often", "Often"),
    )
    drinking = models.CharField(max_length=20, choices=DRINKING_CHOICES, blank=True)

    # Work & Education
    profession = models.CharField(max_length=255, blank=True)
    education = models.CharField(max_length=255, blank=True)

    # Verification
    is_verified = models.BooleanField(default=False)

    # Profile Status
    is_complete = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def check_profile_complete(self):
        required_fields = [
            self.bio,
            self.age,
            self.gender,
            self.location,
        ]

        if all(required_fields) and self.images.exists():
            self.is_complete = True
        else:
            self.is_complete = False

        self.save()

    def __str__(self):
        return f"{self.user} Profile"


class ProfileImage(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="images")

    image = models.ImageField(upload_to="profiles/")
    is_primary = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Ensure only one primary image
        if self.is_primary:
            ProfileImage.objects.filter(profile=self.profile).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image of {self.profile.user}"