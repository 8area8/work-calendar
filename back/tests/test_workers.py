"""Test the workers feature."""
# pylint: disable=redefined-outer-name, unused-argument

import pytest
from django.test import Client

from back.apps.worker.models import Employee


@pytest.fixture
def client():
    """Return the client."""
    return Client()


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
def test_employee_good_creation(client):
    """Expect that we can create a employee."""
    response = client.post(
        "/worker/", {"name": "john", "preference": "morning", "salary": 10}
    )
    assert response.status_code == 201


@pytest.mark.django_db
def test_employee_bad_creation(client):
    """Expect that we can't create a employee if a field is wrong."""
    response = client.post(
        "/worker/", {"name": "john", "preference": "truc", "salary": 10}
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_employee_deletion(client, employee):
    """Expect that we can delete a employee."""
    response = client.delete(f"/worker/{employee.pk}/")
    assert response.status_code == 204


@pytest.mark.django_db
def test_employee_update(client, employee):
    """Expect that we can update a employee."""
    assert employee.name == "john"
    data = {"name": "LoLo", "salary": 11}
    response = client.patch(f"/worker/{employee.pk}/", data, "application/json")
    assert response.status_code == 200
    assert response.json()["name"] == "LoLo"
    employee.refresh_from_db()
    assert employee.name == "LoLo"


@pytest.mark.django_db
def test_employee_bad_update(client, employee):
    """Expect that we can't update a employee if a field is wrong."""
    data = {"preference": "truc"}
    response = client.patch(f"/worker/{employee.pk}/", data, "application/json")
    assert response.status_code == 400


@pytest.mark.django_db
def test_employee_get(client, employee):
    """Expect that we can delete a employee."""
    response = client.get(f"/worker/{employee.pk}/")
    assert response.status_code == 200
    assert response.json()["name"] == "john"


@pytest.mark.django_db
def test_employee_getall(client, employee):
    """Expect that we can delete a employee."""
    response = client.get("/worker/")
    assert response.status_code == 200
    assert response.json()[0]


@pytest.mark.django_db
def test_employee_get_employee_if_superuser(client, employee):
    """Expect that we can delete a employee."""
    response = client.get(f"/worker/{employee.pk}/")
    assert response.status_code == 200
    assert "salary" in response.json()


@pytest.mark.django_db
def test_employee_cant_get_employee_if_not_superuser(client, employee):
    """Expect that we can delete a employee."""
    response = client.get(f"/worker/{employee.pk}/")
    assert response.status_code == 200
    assert "salary" not in response.json()
