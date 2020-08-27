"""Worker urls."""

from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
    path("", views.EmployeeList.as_view()),
    path("<int:pk>/", views.EmployeeDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
