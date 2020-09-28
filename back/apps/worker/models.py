"""Workers models."""

from typing import Tuple
from datetime import datetime
from calendar import Calendar

from django.contrib.postgres.fields import ArrayField
from django.db import IntegrityError
from django.db import transaction

from django.db import models


PREFERENCE_CHOICE = (("morning", 0), ("evening", 1))
DAYS_CHOICE = (
    ("monday", 0),
    ("tuesday", 1),
    ("wednesday", 2),
    ("thursday", 3),
    ("friday", 4),
    ("saturday", 5),
    ("sunday", 6),
)


class Employee(models.Model):
    """Employee model."""

    salary = models.IntegerField()
    name = models.CharField(max_length=30, unique=True)
    preference = models.CharField(choices=PREFERENCE_CHOICE, max_length=20)
    off = ArrayField(models.CharField(choices=DAYS_CHOICE, max_length=30), default=[])


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
        month = month % self.MAX_MONTHS or 1
        year = now.year + month // self.MAX_MONTHS
        return month, year

    def get_month(self, from_now: int = 0) -> "DayManager":
        """Get a month."""
        month, year = self.set_month(from_now)
        monthdays = Calendar().monthdatescalendar(year, month)
        start = monthdays[0][0]
        end = monthdays[-1][-1]
        return self.filter(date__range=(start, end)).order_by("date")

    def create_month(self, from_now: int = 0) -> None:
        """Create a new month."""
        month, year = self.set_month(from_now)
        monthdays = Calendar().monthdatescalendar(year, month)
        days = [day for days in monthdays for day in days]
        for day in days:
            try:
                with transaction.atomic():
                    self.create(date=day)
            except IntegrityError:
                print(f"{day} is a duplicate !")


class Day(models.Model):
    """Day model."""

    date = models.DateField(unique=True)
    employee = models.ManyToManyField(
        Employee,
        through="WorkDay",
        through_fields=("day", "employee"),
    )

    objects: DayManager = DayManager()

    def __str__(self):
        """Define the day."""
        return f"{self.date.year}-{self.date.month}-{self.date.day}"


class WorkDay(models.Model):
    """Work Day class."""

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    day = models.ForeignKey(Day, on_delete=models.CASCADE)
    start = models.DateTimeField(default=None)
    end = models.DateTimeField(default=None)
