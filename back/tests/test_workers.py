"""Test the workers feature."""
# pylint: disable=redefined-outer-name, unused-argument

import pytest
from django.test import Client
from django.contrib.auth import get_user_model

from back.apps.worker.models import Employee


def get_admin_token(client: Client):
    """Get the admin token."""
    resp = client.post("/api/token/", {"username": "admin", "password": "admin"})
    token = resp.json()["access"]
    return {"HTTP_AUTHORIZATION": f"Bearer {token}"}


@pytest.fixture
def client():
    """Return the client."""
    return Client()


@pytest.fixture
def admin():
    """Return a employee."""
    user = get_user_model()
    return user.objects.create_superuser(
        username="admin", password="admin", email="foo@bar.com"
    )


@pytest.fixture
def employee():
    """Return a employee."""
    return Employee.objects.create(name="john", salary=10, preference="morning")


@pytest.mark.django_db
def test_employee_attributes(employee):
    """Expect that we can get a specific employee.

    He has a name, a employee and a preference.
    """
    assert employee
    assert hasattr(employee, "name")
    assert hasattr(employee, "salary")
    assert hasattr(employee, "preference")


@pytest.mark.django_db
def employee_preference_can_be_morning_or_evening():
    """Expect the employee preference field can be one of the two values."""
    with pytest.raises(ValueError):
        Employee.objects.create(name="foo", salary=10, preference="truc")


@pytest.mark.django_db
def test_employee_good_creation(admin, client: Client):
    """Expect that we can create a employee."""
    token_header = get_admin_token(client)
    response = client.post(
        "/api/work/employees/",
        {"name": "john", "preference": "morning", "salary": 10},
        **token_header,
    )
    assert response.status_code == 201


@pytest.mark.django_db
def test_employee_bad_creation(admin, client: Client):
    """Expect that we can't create a employee if a field is wrong."""
    token_header = get_admin_token(client)
    response = client.post(
        "/api/work/employees/",
        {"name": "john", "preference": "truc", "salary": 10},
        **token_header,
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_employee_deletion(admin, client, employee):
    """Expect that we can delete a employee."""
    token_header = get_admin_token(client)
    response = client.delete(f"/api/work/employees/{employee.pk}/", **token_header)
    assert response.status_code == 204


@pytest.mark.django_db
def test_employee_update(admin, client, employee):
    """Expect that we can update a employee."""
    token_header = get_admin_token(client)
    assert employee.name == "john"
    data = {"name": "LoLo", "salary": 11}
    response = client.patch(
        f"/api/work/employees/{employee.pk}/", data, "application/json", **token_header
    )
    assert response.status_code == 200
    assert response.json()["name"] == "LoLo"
    employee.refresh_from_db()
    assert employee.name == "LoLo"


@pytest.mark.django_db
def test_employee_bad_update(admin, client, employee):
    """Expect that we can't update a employee if a field is wrong."""
    token_header = get_admin_token(client)
    data = {"preference": "truc"}
    response = client.patch(
        f"/api/work/employees/{employee.pk}/", data, "application/json", **token_header
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_employee_get(client, employee):
    """Expect that we can delete a employee."""
    response = client.get(f"/api/work/employees/{employee.pk}/")
    assert response.status_code == 200
    assert response.json()["name"] == "john"


@pytest.mark.django_db
def test_employee_getall(client, employee):
    """Expect that we can delete a employee."""
    response = client.get("/api/work/employees/")
    assert response.status_code == 200
    assert response.json()[0]


@pytest.mark.django_db
def test_employee_get_employee_if_superuser(admin, client, employee):
    """Expect that we can delete a employee."""
    token_header = get_admin_token(client)
    response = client.get(f"/api/work/employees/{employee.pk}/", **token_header)
    assert response.status_code == 200
    assert "salary" in response.json()


@pytest.mark.django_db
def test_employee_cant_get_employee_if_not_superuser(client, employee):
    """Expect that we can delete a employee."""
    response = client.get(f"/api/work/employees/{employee.pk}/")
    assert response.status_code == 200
    assert "salary" not in response.json()
