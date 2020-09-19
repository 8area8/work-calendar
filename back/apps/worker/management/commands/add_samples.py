"""Add some data inside the database."""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

from back.apps.worker.models import Employee


class Command(BaseCommand):
    """Command class."""

    help = "Add data sample."

    def handle(self, *args, **options):
        """Handle command."""
        User = get_user_model()
        try:
            User.objects.create_superuser(
                username="admin", email="foo@bar.com", password="admin"
            )
        except IntegrityError:
            print("Admin user is already defined.")
        try:
            User.objects.create_user(
                username="john", email="john@bar.com", password="john"
            )
        except IntegrityError:
            print("user is already defined.")

        try:
            Employee.objects.create(name="foo", salary=10, preference="morning")
            Employee.objects.create(name="bar", salary=11, preference="evening")
        except IntegrityError:
            print("Employees are already defined.")
