"""Worker urls."""

from django.urls import path, include, register_converter

from rest_framework.routers import DefaultRouter

from . import views


class NegativeIntConverter:
    """URL converter - catch negative integers."""

    regex = r"-?\d+"

    def to_python(self, value):
        """To python."""
        return int(value)

    def to_url(self, value):
        """To url."""
        return "%d" % value


register_converter(NegativeIntConverter, "negint")


router = DefaultRouter()
router.register("employees", views.EmployeeViewSet)
router.register("workdays", views.WorkDayViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("month/<negint:from_now>/", views.get_month, name="get_month"),
    path(
        "workdays_from_day/<int:day_id>/",
        views.get_workday_from_day_id,
        name="workdays_from_day",
    ),
]
