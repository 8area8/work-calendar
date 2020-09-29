"""Test the day creation."""
# pylint: skip-file

from datetime import datetime
from calendar import monthrange, Calendar

import pytest

from back.apps.worker.models import Day
from back.apps.worker.management.commands import update_days, create_initial_days
from back.tests import admin, get_token, client, user


now = datetime.now()


def test_day_model_contains_date():
    """Test Day attrs."""
    assert Day.date  # type: ignore


@pytest.mark.django_db
def test_days_data_of_current_month():
    """Test days logic."""
    monthdays = Calendar().monthdatescalendar(now.year, now.month)
    monthdays = [date for dates in monthdays for date in dates]
    create_initial_days.Command().handle()
    days = Day.objects.get_month(0)

    for day, date in zip(days, monthdays):
        assert day.date.day == date.day  # type: ignore
        assert day.date.year == date.year  # type: ignore
        assert day.date.month == date.month  # type: ignore


@pytest.mark.django_db
def test_days_of_last_month_exists():
    """Test days of last month."""
    create_initial_days.Command().handle()
    days = Day.objects.get_month(-1)
    assert monthrange(year=now.year, month=now.month + -1)[1] <= len(days) <= 46


@pytest.mark.django_db
def test_days_of_current_month_exists():
    """Test days of current month."""
    create_initial_days.Command().handle()
    days = Day.objects.get_month(0)
    assert monthrange(year=now.year, month=now.month + 0)[1] <= len(days) <= 40


@pytest.mark.django_db
def test_days_of_next_month_exists():
    """Test days of next minth."""
    create_initial_days.Command().handle()
    days = Day.objects.get_month(1)
    assert monthrange(year=now.year, month=now.month + 1)[1] <= len(days) <= 40


@pytest.mark.django_db
def test_days_of_two_months_difference_is_equal_to_seven_or_zero():
    """Test there is no days in others months."""
    create_initial_days.Command().handle()
    last_days = len(Day.objects.get_month(-2))
    next_days = len(Day.objects.get_month(2))
    assert last_days == 7 or last_days == 0
    assert next_days == 7 or next_days == 0


@pytest.mark.django_db
def test_days_of_last_month_are_deleted_after_recreation_on_new_month():
    """Test days update - last month delete."""
    create_initial_days.Command().handle()
    update_days.Command().handle()

    days = Day.objects.get_month(-2)
    assert len(days) < 7


@pytest.mark.django_db
def test_days_of_next_month_exists_after_recreation_on_new_month():
    """Test days update - 2 next month created."""
    create_initial_days.Command().handle()
    update_days.Command().handle()

    days = Day.objects.get_month(1)
    assert len(days) > 7


@pytest.mark.django_db
def test_month_creation():
    """Test the month creation."""
    create_initial_days.Command().handle()
    Day.objects.create_month(3)

    days = Day.objects.get_month(3)
    assert len(days) > 7


@pytest.mark.django_db
def test_month_route(client, user):
    """Test the month route."""
    create_initial_days.Command().handle()
    token_header = get_token(client, False)

    response = client.get("/api/work/month/-1/", **token_header)
    assert response.status_code == 200
    assert 27 < len(response.json()) < 50

    response = client.get("/api/work/month/0/", **token_header)
    assert response.status_code == 200
    assert 27 < len(response.json()) < 50

    response = client.get("/api/work/month/1/", **token_header)
    assert response.status_code == 200
    assert 27 < len(response.json()) < 50

    response = client.get("/api/work/month/2/", **token_header)
    assert response.status_code == 200
    days = len(response.json())
    assert days == 7 or days == 0


@pytest.mark.django_db
def test_month_days_contains_alls_week_days(client, user):
    """Ensure the days from a month can contains days from last or next month."""
    create_initial_days.Command().handle()
    token_header = get_token(client, False)

    response = client.get("/api/work/month/0/", **token_header)
    days = response.json()
    last_month = now.month - 1 if now.month != 1 else 12
    next_month = now.month + 1 if now.month != 12 else 1
    months = [day["month"] for day in days]
    assert last_month in months or next_month in months
