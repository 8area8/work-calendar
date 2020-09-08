"""Tests package."""

import pytest

from django.test import Client
from django.contrib.auth import get_user_model

from back.apps.worker.models import Employee


def get_token(client: Client, is_admin: bool = True):
    """Get an user token."""
    user_data = "admin" if is_admin else "user"
    params = {"username": user_data, "password": user_data}

    resp = client.post("/api/token/", params)
    token = resp.json()["access"]

    return {"HTTP_AUTHORIZATION": f"Bearer {token}"}


@pytest.fixture
def client():
    """Return the client."""
    return Client()


@pytest.fixture
def admin():
    """Return a employee."""
    User = get_user_model()
    return User.objects.create_superuser(
        username="admin", password="admin", email="foo@bar.com"
    )


@pytest.fixture
def user():
    """Return a employee."""
    User = get_user_model()
    return User.objects.create_user(username="user", password="user")


@pytest.fixture
def employee():
    """Return a employee."""
    return Employee.objects.create(name="john", salary=10, preference="morning")
