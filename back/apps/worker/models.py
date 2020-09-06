"""Workers models."""

from typing import Tuple
from datetime import datetime, date
from calendar import monthrange

from django.db import models


PREFERENCE_CHOICE = (("morning", 0), ("evening", 1))


class Employee(models.Model):
    """Employee model."""

    salary = models.IntegerField()
    name = models.CharField(max_length=30, unique=True)
    preference = models.CharField(choices=PREFERENCE_CHOICE, max_length=20)


class DayManager(models.Manager):
    """Manager for Day."""

    MAX_MONTHS = 12

    def set_month(self, from_now: int) -> Tuple[int, int]:
        """Return the month and the year.

        Args:
            from_now (int): the number of month from now.

        Returns:
            tuple: the month and the year.
        """
        now = datetime.now()
        month = now.month + from_now
        month = month % self.MAX_MONTHS
        year = now.year + month // self.MAX_MONTHS
        return month, year

    def get_month(self, from_now: int = 0):
        """Get a month."""
        month, year = self.set_month(from_now)
        return self.filter(month=month, year=year)

    def create_month(self, from_now: int = 0):
        """Create a new month."""
        month, year = self.set_month(from_now)
        month_len = monthrange(year=year, month=month)[1]
        days = range(1, month_len + 1)

        for day in days:
            Day.objects.create(year=year, month=month, number=day)


class Day(models.Model):
    """Day model."""

    year = models.IntegerField()
    month = models.IntegerField()
    number = models.IntegerField()

    objects: DayManager = DayManager()

    def __str__(self):
        """Define the day."""
        return f"{self.year}-{self.month}-{self.number}"
