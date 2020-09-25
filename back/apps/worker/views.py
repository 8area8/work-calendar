"""Worker views."""

from django.http.response import JsonResponse
from django.http import HttpRequest
from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.decorators import api_view, permission_classes

from .models import Employee, Day, WorkDay
from .serializers import (
    EmployeeSerializerForAdmin,
    EmployeeSerializerForUser,
    WorkDaySerializer,
)


class IsAdminOrAuthenticatedReadOnly(BasePermission):
    """Is admin or read only for authenticated users."""

    def has_permission(self, request: HttpRequest, view):
        """Return bool."""
        return (
            request.method in SAFE_METHODS
            and request.user.is_authenticated
            or request.user.is_superuser
        )


class EmployeeViewSet(viewsets.ModelViewSet):
    """Employee view set."""

    queryset = Employee.objects.all()

    permission_classes = [IsAdminOrAuthenticatedReadOnly]

    def get_serializer_class(self):
        """Get the good serializer."""
        if self.request.user.is_superuser:
            return EmployeeSerializerForAdmin

        return EmployeeSerializerForUser


@api_view(["GET"])
@permission_classes([IsAdminOrAuthenticatedReadOnly])
def get_month(request, from_now: int):
    """Return a list of days, from a specific month."""
    days = []
    queryset = Day.objects.get_month(from_now)
    for day in queryset:
        workdays = day.workday_set.values()
        serialized_day = {
            "id": day.id,
            "year": day.date.year,
            "month": day.date.month,
            "number": day.date.day,
            "works": list(workdays),
        }
        days.append(serialized_day)
    return JsonResponse(days, safe=False)


class WorkDayViewSet(viewsets.ModelViewSet):
    """WorkDay viewset."""

    queryset = WorkDay.objects.all()
    serializer_class = WorkDaySerializer
    permission_classes = [IsAdminOrAuthenticatedReadOnly]


@api_view(["GET"])
@permission_classes([IsAdminOrAuthenticatedReadOnly])
def get_workday_from_day_id(request, day_id: int):
    """Return a list of workdays, from a specific day."""
    workdays = []
    queryset = WorkDay.objects.filter(day_id=day_id)
    for workday in queryset:
        serialized_workday = {
            "id": workday.id,
            "day": workday.day.id,
            "employee": workday.employee.id,
            "start": workday.start,
            "end": workday.end,
        }
        workdays.append(serialized_workday)
    return JsonResponse(workdays, safe=False)
