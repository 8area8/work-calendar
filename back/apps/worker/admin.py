from django.contrib import admin
from .models import Day, WorkDay, Employee


class DayAdmin(admin.ModelAdmin):
    readonly_fields = ("id",)


class EmployeeAdmin(admin.ModelAdmin):
    readonly_fields = ("id",)


class WorkDayAdmin(admin.ModelAdmin):
    readonly_fields = ("id",)


admin.site.register(Day, DayAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(WorkDay, WorkDayAdmin)
