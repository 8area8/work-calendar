"""Test the workers feature."""
# pylint: disable=redefined-outer-name, unused-argument

import pytest
from django.test import Client

from back.apps.worker.models import Salary


@pytest.fixture
def client():
    """Return the client."""
    return Client()


@pytest.fixture
def salary():
    """Return a salary."""
    return Salary.objects.create(name="jhon", salary=10, preference="morning")


@pytest.mark.django_db
def test_salary_attributes(salary):
    """Expect that we can get a specific salary.

    He has a name, a salary and a preference.
    """
    assert salary
    assert hasattr(salary, "name")
    assert hasattr(salary, "salary")
    assert hasattr(salary, "preference")


@pytest.mark.django_db
def test_salary_good_creation(client):
    """Expect that we can create a salary."""
    response = client.post(
        "/worker/", {"name": "john", "preference": "morning", "salary": 10}
    )
    assert response.status_code == 201


@pytest.mark.django_db
def test_salary_bad_creation(client):
    """Expect that we can't create a salary if a field is wrong."""
    response = client.post(
        "/worker/", {"name": "john", "preference": "truc", "salary": 10}
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_salary_deletion(client, salary):
    """Expect that we can delete a salary."""
    response = client.delete(f"/worker/{salary.pk}/")
    assert response.status_code == 204


@pytest.mark.django_db
def test_salary_update(client, salary):
    """Expect that we can update a salary."""
    assert salary.name == "jhon"
    data = {"name": "LoLo", "salary": 11}
    response = client.patch(f"/worker/{salary.pk}/", data, "application/json")
    assert response.status_code == 200
    assert response.json()["name"] == "LoLo"
    salary.refresh_from_db()
    assert salary.name == "LoLo"


@pytest.mark.django_db
def test_salary_bad_update(client, salary):
    """Expect that we can't update a salary if a field is wrong."""
    data = {"preference": "truc"}
    response = client.patch(f"/worker/{salary.pk}/", data, "application/json")
    assert response.status_code == 400


@pytest.mark.django_db
def test_salary_get(client, salary):
    """Expect that we can delete a salary."""
    response = client.get(f"/worker/{salary.pk}/")
    assert response.status_code == 200
    assert response.json()["name"] == "jhon"


@pytest.mark.django_db
def test_salary_getall(client, salary):
    """Expect that we can delete a salary."""
    response = client.get("/worker/")
    assert response.status_code == 200
    assert response.json()[0]


@pytest.mark.django_db
def test_salary_get_salary_if_superuser(client, salary):
    """Expect that we can delete a salary."""
    response = client.get(f"/worker/{salary.pk}/")
    assert response.status_code == 200
    assert "salary" in response.json()


@pytest.mark.django_db
def test_salary_cant_get_salary_if_not_superuser(client, salary):
    """Expect that we can delete a salary."""
    response = client.get(f"/worker/{salary.pk}/")
    assert response.status_code == 200
    assert "salary" not in response.json()
