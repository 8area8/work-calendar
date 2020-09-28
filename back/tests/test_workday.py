"""Test the work day."""
# pylint: skip-file

from datetime import datetime
import pytest

from back.apps.worker.management.commands import create_initial_days
from back.apps.worker.models import WorkDay
from back.tests import client, admin, user, employee, get_token


now = datetime.now().isoformat()


@pytest.mark.django_db
def test_work_day_attributes():
    """Test WorkDay attributes."""
    assert WorkDay.id  # type: ignore
    assert WorkDay.day  # type: ignore
    assert WorkDay.employee  # type: ignore
    assert WorkDay.start  # type: ignore
    assert WorkDay.end  # type: ignore


@pytest.mark.django_db
def test_retrieve_workday_in_month(client, admin, employee):
    """Find a spectifi workday."""
    create_initial_days.Command().handle()
    token_header = get_token(client)

    response = client.get("/api/work/month/0/", **token_header)
    day = response.json()[0]

    response = client.post(
        "/api/work/workdays/",
        {"day": day["id"], "employee": employee.id, "start": now, "end": now},
        **token_header,
    )
    assert response.status_code == 201

    response = client.get("/api/work/month/0/", **token_header)
    day = response.json()[0]
    assert day["works"][0]["employee"] == employee.id


@pytest.mark.django_db
def test_work_day_admin_creation(admin, client, employee):
    """Test the wrok day creation."""
    create_initial_days.Command().handle()
    token_header = get_token(client)

    response = client.get("/api/work/month/0/", **token_header)
    day = response.json()[0]

    response = client.post(
        "/api/work/workdays/",
        {"day": day["id"], "employee": employee.id, "start": now, "end": now},
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
        "/api/work/workdays/",
        {"day": day["id"], "employee": employee.id, "start": now, "end": now},
        **token_header,
    )
    assert response.status_code == 403
