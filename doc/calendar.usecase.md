# Calendar UseCase

## Calendar Modes

The calendar has two modes:

- a global mode if no search has been made in the selection bar. This mode allows you to view all employees every day.
- a filtered mode if an employee has been selected. This mode allows you to view the days worked by the employee and his working hours.

## User usage

- Going from month to month
- Going from year to year
- select an employee to get the second mode

## Admin usage

- all features of user
- Select a day to access the employee modification on that day

## The select bar

The select bar allows you to select an employee by name.

- If the selection bar is empty, then the mode will be the general mode.
- If the selection bar is focused on an employee, then the selection bar will be focused on the filtered mode.

## Day selection

We can click on a day in the calendar to access the workers of that day in a new window.

The window lists the workers:

- their name
- their start time
- their end time
- their total hours (read only for all)

The administrator can **change** the hours, **delete** an employee on that day or **add** new ones. Users have **read-only access**.

## Overview of a day

The overview of a day displays a small tooltip with the names of today's employees.
