from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="StudentVerification",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("college_name", models.CharField(max_length=160)),
                ("college_email", models.EmailField(max_length=254)),
                ("student_id_image", models.ImageField(blank=True, null=True, upload_to="college_verification/")),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("not_submitted", "Not Submitted"),
                            ("pending", "Pending"),
                            ("approved", "Approved"),
                            ("rejected", "Rejected"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="student_verification",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddIndex(
            model_name="studentverification",
            index=models.Index(fields=["user", "status"], name="collegeMode_user_id_6d604c_idx"),
        ),
        migrations.AddIndex(
            model_name="studentverification",
            index=models.Index(fields=["college_email"], name="collegeMode_college_1b83d3_idx"),
        ),
    ]
