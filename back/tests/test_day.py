"""Test the day creation."""
# pylint: disable=all

from datetime import datetime
from calendar import monthrange

import pytest

from back.apps.worker.models import Day
from back.apps.worker.management.commands import update_days, create_initial_days
from back.tests import admin, get_admin_token, client


now = datetime.now()


def test_day_model_contains_year_month_and_number():
    assert Day.year
    assert Day.month
    assert Day.number


@pytest.mark.django_db
def test_days_data_of_current_month():
    create_initial_days.Command().handle()
    days = Day.objects.get_month(0)
    for index, day in enumerate(days):
        assert day.number == index + 1
        assert day.year == now.year
        assert day.month == now.month


@pytest.mark.django_db
def test_days_of_last_month_exists():
    create_initial_days.Command().handle()
    days = Day.objects.get_month(-1)
    assert len(days) == monthrange(year=now.year, month=now.month + -1)[1]


@pytest.mark.django_db
def test_days_of_current_month_exists():
    create_initial_days.Command().handle()
    days = Day.objects.get_month(0)
    assert len(days) == monthrange(year=now.year, month=now.month + 0)[1]


@pytest.mark.django_db
def test_days_of_next_month_exists():
    create_initial_days.Command().handle()
    days = Day.objects.get_month(1)
    assert len(days) == monthrange(year=now.year, month=now.month + 1)[1]


@pytest.mark.django_db
def test_days_of_two_months_difference_doesnt_exists():
    create_initial_days.Command().handle()
    assert len(Day.objects.get_month(-2)) == 0
    assert len(Day.objects.get_month(2)) == 0


@pytest.mark.django_db
def test_days_of_last_month_are_deleted_after_recreation_on_new_month():
    create_initial_days.Command().handle()
    update_days.Command().handle()

    days = Day.objects.get_month(-1)
    assert len(days) == 0


@pytest.mark.django_db
def test_days_of_next_month_exists_after_recreation_on_new_month():
    create_initial_days.Command().handle()
    update_days.Command().handle()

    days = Day.objects.get_month(2)
    assert len(days) > 0


@pytest.mark.django_db
def test_month_route(client, admin):
    create_initial_days.Command().handle()

    response = client.get("/api/work/month/0/")
    assert response.status_code == 200
    assert 27 < len(response.json()) < 32

    response = client.get("/api/work/month/1/")
    assert response.status_code == 200
    assert 27 < len(response.json()) < 32

    response = client.get("/api/work/month/2/")
    assert response.status_code == 200
    assert len(response.json()) == 0
