"""Worker serializers."""

from rest_framework import serializers

from .models import Employee


class EmployeeSerializerForUser(serializers.ModelSerializer):
    """Employee serializer."""

    class Meta:
        """Meta."""

        model = Employee
        fields = ["id", "name", "preference"]
        read_only_fields = ("id", "name", "preference")


class EmployeeSerializerForAdmin(serializers.ModelSerializer):
    """Employee serializer."""

    class Meta:
        """Meta."""

        model = Employee
        fields = ["id", "name", "salary", "preference"]
