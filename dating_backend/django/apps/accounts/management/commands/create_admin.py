from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()

        if not User.objects.filter(username="irfan").exists():
            User.objects.create_superuser(
                username="irfan",
                email="irfanalam9682@gmail.com",
                password="IrfaN@664271",
                full_name="Irfan Alam"   # 🔥 REQUIRED FIELD
            )
            self.stdout.write("Admin created")
        else:
            self.stdout.write("Admin already exists")
