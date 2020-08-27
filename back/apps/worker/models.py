"""Workers models."""

from django.db import models


PREFERENCE_CHOICE = (("morning", 0), ("evening", 1))


class Employee(models.Model):
    """Employee model."""

    salary = models.IntegerField()
    name = models.CharField(max_length=30, unique=True)
    preference = models.CharField(choices=PREFERENCE_CHOICE, max_length=20)
