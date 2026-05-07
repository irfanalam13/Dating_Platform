from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0007_alter_profileview_unique_together_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="relationship_intent",
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AddField(
            model_name="profile",
            name="education",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="profile",
            name="career",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="profile",
            name="values",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="profile",
            name="ethnicity",
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
