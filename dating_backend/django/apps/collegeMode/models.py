from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class StudentVerification(models.Model):
    STATUS_CHOICES = (
        ("not_submitted", "Not Submitted"),
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_verification")
    college_name = models.CharField(max_length=160)
    college_email = models.EmailField()
    student_id_image = models.ImageField(upload_to="college_verification/", null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["college_email"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.college_name} ({self.status})"
