"""Worker views."""

from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import Employee
from .serializers import EmployeeSerializerForAdmin, EmployeeSerializerForUser


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
