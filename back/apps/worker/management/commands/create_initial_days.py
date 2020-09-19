"""Create the days."""

from django.core.management.base import BaseCommand

from back.apps.worker.models import Day


class Command(BaseCommand):
    """Command class."""

    help = "Create the days for the first time."

    def handle(self, *args, **options):
        """Handle command."""
        Day.objects.create_month(from_now=-1)
        Day.objects.create_month(from_now=0)
        Day.objects.create_month(from_now=1)
