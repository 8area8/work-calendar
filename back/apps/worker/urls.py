"""Worker urls."""

from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views


router = DefaultRouter()
router.register("employees", views.EmployeeViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
