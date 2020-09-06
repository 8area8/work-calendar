"""Worker urls."""

from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views


router = DefaultRouter()
router.register("employees", views.EmployeeViewSet)
router.register("workday", views.WorkDayViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("month/<int:from_now>/", views.get_month, name="get_month"),
]
