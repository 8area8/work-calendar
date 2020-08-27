"""Worker views."""

from rest_framework import generics

from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeList(generics.ListCreateAPIView):
    """List salaries or create a salary."""

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class EmployeeDetail(generics.RetrieveUpdateDestroyAPIView):
    """Update delete or get a salary."""

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
