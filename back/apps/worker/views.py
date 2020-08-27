"""Worker views."""

from rest_framework import generics

from .models import Salary
from .serializers import SalarySerializer


class SalaryList(generics.ListCreateAPIView):
    """List salaries or create a salary."""

    queryset = Salary.objects.all()
    serializer_class = SalarySerializer


class SalaryDetail(generics.RetrieveUpdateDestroyAPIView):
    """Update delete or get a salary."""

    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
