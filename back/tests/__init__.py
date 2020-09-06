"""Tests package."""

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
