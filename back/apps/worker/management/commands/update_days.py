"""Update the days."""

from django.core.management.base import BaseCommand

from back.apps.worker.models import Day


class Command(BaseCommand):
    """Command class."""

    help = "Update the days. NOTE: use it the first day of each month."

    def handle(self, *args, **options):
        """Handle command."""
        Day.objects.get_month(from_now=-2, until_last_of_week=False).delete()
        Day.objects.create_month(from_now=1)
