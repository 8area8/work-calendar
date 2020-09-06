"""Worker views."""

from django.http.response import JsonResponse
from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import Employee, Day, WorkDay
from .serializers import (
    EmployeeSerializerForAdmin,
    EmployeeSerializerForUser,
    WorkDaySerializer,
)


class IsAdminUserOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_superuser


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    queryset = Employee.objects.all()

    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_class(self):
        """Get the good serializer."""
        if self.request.user.is_superuser:
            return EmployeeSerializerForAdmin

        return EmployeeSerializerForUser


def get_month(request, from_now: int):
    """Return a list of days, from a specific month."""
    days = []
    queryset = Day.objects.get_month(from_now)
    for day in queryset:
        employees = day.workday_set.values()
        serialized_day = {
            "id": day.id,
            "year": day.year,
            "month": day.month,
            "number": day.number,
            "employees": list(employees),
        }
        days.append(serialized_day)
    return JsonResponse(days, safe=False)


class WorkDayViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    queryset = WorkDay.objects.all()
    serializer_class = WorkDaySerializer
    permission_classes = [IsAdminUserOrReadOnly]
