"""Update the days."""

from django.core.management.base import BaseCommand

from back.apps.worker.models import Day


class Command(BaseCommand):
    """Command class."""

    help = "Update the days."

    def handle(self, *args, **options):
        """Handle command."""
        Day.objects.get_month(from_now=-1).delete()
        Day.objects.create_month(from_now=2)
