from django.contrib import admin
from .models import Day, WorkDay, Employee


class DayAdmin(admin.ModelAdmin):
    pass


class EmployeeAdmin(admin.ModelAdmin):
    pass


class WorkDayAdmin(admin.ModelAdmin):
    pass


admin.site.register(Day, DayAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(WorkDay, WorkDayAdmin)
