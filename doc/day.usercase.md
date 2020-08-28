# Day usecase

## Definition

- each day contains :
  - the day date
  - a list of morning employees
  - a list of evening employees
- each list contains employees with the following data:
  - the employee name
  - the employee preference
  - a start hour
  - an end hour
  - **read only** : the total number of hours

## User usage

- a user is able to get all days of the month
- a user is able to access the days corresponding to a specific employee

## Admin usage

- an admin is able to add an employee to a list
- an admin is able to delete an employee from a list
- an admin is able to change the employee start and end hour

## Tech part

- a cron task run each end of the month and:
  - delete all days of the penultimate month
  - create every day of the next month
