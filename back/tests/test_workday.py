"""Test the work day."""

import pytest

from back.apps.worker.management.commands import create_initial_days
from back.apps.worker.models import WorkDay
from back.tests import client, admin, user, employee, get_token


@pytest.mark.django_db
def test_work_day_attributes():
    """Test WorkDay attributes."""
    assert WorkDay.id
    assert WorkDay.day
    assert WorkDay.employee
    assert WorkDay.start
    assert WorkDay.end


@pytest.mark.django_db
def test_retrieve_workday_in_month(client, admin, employee):
    create_initial_days.Command().handle()
    token_header = get_token(client)

    response = client.get("/api/work/month/0/", **token_header)
    day = response.json()[0]

    response = client.post(
        "/api/work/workday/",
        {"day": day["id"], "employee": employee.id, "start": 11, "end": 20},
        **token_header,
    )
    assert response.status_code == 201

    response = client.get("/api/work/month/0/", **token_header)
    day = response.json()[0]
    assert day["employees"][0]["employee_id"] == employee.id


@pytest.mark.django_db
def test_work_day_admin_creation(admin, client, employee):
    """Test the wrok day creation."""
    create_initial_days.Command().handle()
    token_header = get_token(client)

    response = client.get("/api/work/month/0/", **token_header)
    day = response.json()[0]

    response = client.post(
        "/api/work/workday/",
        {"day": day["id"], "employee": employee.id, "start": 11, "end": 20},
        **token_header,
    )
    assert response.status_code == 201


@pytest.mark.django_db
def test_work_day_not_admin_creation(user, client, employee):
    """Test fail work day creation."""
    create_initial_days.Command().handle()

    token_header = get_token(client, False)
    response = client.get("/api/work/month/0/", **token_header)
    day = response.json()[0]

    response = client.post(
        "/api/work/workday/",
        {"day": day["id"], "employee": employee.id, "start": 11, "end": 20},
        **token_header,
    )
    assert response.status_code == 403
