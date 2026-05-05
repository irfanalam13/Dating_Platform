from django.db import models
# from apps.profiles.models.profile import Profile
from apps.accounts.models import User
from django.db import models


class Religion(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name or "Unknown"

class Caste(models.Model):
    name = models.CharField(max_length=100)
    religion = models.ForeignKey(Religion, on_delete=models.CASCADE, related_name="castes")

    class Meta:
        unique_together = ("name", "religion")
    def __str__(self):
        return f"{self.name} ({self.religion.name})"

class Gotra(models.Model):
    name = models.CharField(max_length=100)
    caste = models.ForeignKey(Caste, on_delete=models.CASCADE, related_name="gotras")

    class Meta:
        unique_together = ("name", "caste")

    def __str__(self):
        return f"{self.name} ({self.caste.name})"
    

class CulturalProfile(models.Model):
    profile = models.ForeignKey('profiles.Profile', on_delete=models.CASCADE, related_name="cultural")
    religion = models.ForeignKey(Religion, on_delete=models.SET_NULL, null=True)
    caste = models.ForeignKey(Caste, on_delete=models.SET_NULL, null=True, blank=True)
    gotra = models.ForeignKey(Gotra, on_delete=models.SET_NULL, null=True, blank=True)
    mother_tongue = models.CharField(max_length=50)
    education = models.CharField(max_length=100)
    occupation = models.CharField(max_length=100)
    is_visible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.profile.user.username} Cultural Info"

class Preferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    min_age = models.IntegerField(default=18)
    max_age = models.IntegerField(default=35)
    preferred_gender = models.CharField(max_length=10)
    city = models.CharField(max_length=100, blank=True)
    religion = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"Preferences of {self.user.email}"
