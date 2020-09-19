"""Test the workers feature."""
# pylint: skip-file

import pytest
from django.test import Client

from back.apps.worker.models import Employee
from back.tests import get_token, client, user, admin, employee


@pytest.mark.django_db
def test_employee_attributes(employee: Employee):
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
    assert Employee.objects.create(name="foo", salary=10, preference="morning")
    assert Employee.objects.create(name="foo", salary=10, preference="evening")


@pytest.mark.django_db
def test_employee_good_creation(admin, client: Client):
    """Expect that we can create a employee."""
    token_header = get_token(client)
    response = client.post(
        "/api/work/employees/",
        {"name": "john", "preference": "morning", "salary": 10},
        **token_header,
    )
    assert response.status_code == 201


@pytest.mark.django_db
def test_employee_bad_creation(admin, client: Client):
    """Expect that we can't create a employee if a field is wrong."""
    token_header = get_token(client)
    response = client.post(
        "/api/work/employees/",
        {"name": "john", "preference": "truc", "salary": 10},
        **token_header,
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_employee_deletion(admin, client, employee):
    """Expect that we can delete a employee."""
    token_header = get_token(client)
    response = client.delete(f"/api/work/employees/{employee.pk}/", **token_header)
    assert response.status_code == 204


@pytest.mark.django_db
def test_employee_update(admin, client, employee):
    """Expect that we can update a employee."""
    token_header = get_token(client)
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
    token_header = get_token(client)
    data = {"preference": "truc"}
    response = client.patch(
        f"/api/work/employees/{employee.pk}/", data, "application/json", **token_header
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_employee_get(client, user, employee):
    """Expect that we can get an employee."""
    token_header = get_token(client, False)
    response = client.get(f"/api/work/employees/{employee.pk}/", **token_header)
    assert response.status_code == 200
    assert response.json()["name"] == "john"


@pytest.mark.django_db
def test_employee_getall(client, user, employee):
    """Expect that we can get all employees."""
    token_header = get_token(client, False)
    response = client.get("/api/work/employees/", **token_header)
    assert response.status_code == 200
    assert response.json()[0]


@pytest.mark.django_db
def test_employee_get_employee_if_superuser(admin, client, employee):
    """Expect that we can get an employee."""
    token_header = get_token(client)
    response = client.get(f"/api/work/employees/{employee.pk}/", **token_header)
    assert response.status_code == 200
    assert "salary" in response.json()


@pytest.mark.django_db
def test_employee_cant_get_employee_if_not_superuser(client, user, employee):
    """Expect that we can get an employee."""
    token_header = get_token(client, False)
    response = client.get(f"/api/work/employees/{employee.pk}/", **token_header)
    assert response.status_code == 200
    assert "salary" not in response.json()
