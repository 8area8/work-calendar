"""Worker serializers."""

from rest_framework import serializers

from .models import Employee, WorkDay


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


class WorkDaySerializer(serializers.ModelSerializer):
    """WorkDay serializer."""

    class Meta:
        """Meta."""

        model = WorkDay
        fields = ["id", "start", "end", "day", "employee"]
