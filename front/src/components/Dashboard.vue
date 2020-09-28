<template>
  <div class="container has-text-centered box" style="margin-top: 1em">
    <div class="table-container">
      <div class="dashboard__title">Tableau de bord</div>
      <div v-if="$store.state.employeeID === -1">
        <div class="title is-size-5">Salaires net mensuels</div>
        <table
          class="table is-bordered is-striped"
          style="margin: auto; margin-top: 1em"
        >
          <thead>
            <tr>
              <th>Employé</th>
              <th><abbr>Jours travaillés</abbr></th>
              <th><abbr>Total heures</abbr></th>
              <th><abbr>Salaire net horaire</abbr></th>
              <th><abbr>Salaire net mensuel</abbr></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="employee in employees"
              :key="'month-salary-' + employee.id"
            >
              <td style="vertical-align: middle;">
                {{ employee.name }}
              </td>
              <td style="vertical-align: middle;">
                {{ getEmployeeWorks(employee.id).length }}
              </td>
              <td style="vertical-align: middle;">
                {{ getReadableWorksHours(employee.id) }}
              </td>
              <td style="vertical-align: middle;">
                {{ employee.salary }}
              </td>
              <td style="vertical-align: middle;">
                {{ getSalary(employee) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <div class="title is-size-5">
          Salaire hebdomadaire de
          {{
            employees.find((elem) => elem.id == $store.state.employeeID).name
          }}
          (salaire net horaire :
          {{
            employees.find((elem) => elem.id == $store.state.employeeID).salary
          }}
          euros)
        </div>
        <table
          class="table is-bordered is-striped"
          style="margin: auto; margin-top: 1em"
        >
          <thead>
            <tr>
              <th>Numéro de semaine</th>
              <th><abbr>Jours travaillés</abbr></th>
              <th><abbr>Total heures</abbr></th>
              <th><abbr>Salaires net Hebdomadaires</abbr></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(week, index) in getWeeks()"
              :key="'week-salary-' + index"
            >
              <td style="vertical-align: middle;">
                {{ index + 1 }}
              </td>
              <td style="vertical-align: middle;">
                {{ week.length }}
              </td>
              <td style="vertical-align: middle;">
                {{ workHandler.getReadableWorksHours(week) }}
              </td>
              <td style="vertical-align: middle;">
                {{ getWeekSalary(week) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Component, Vue } from "vue-property-decorator";

import { IEmployee } from "../clean_architecture/entities/worker";
import { IWorkDate, IDay } from "../clean_architecture/entities/calendar";

import { calendarHandler } from "../clean_architecture/interactors/calendar";
import { employeeHandler } from "../clean_architecture/interactors/employee";
import { workHandler } from "../clean_architecture/interactors/work";

@Component
export default class Dashboard extends Vue {
  calendar = calendarHandler;
  workHandler = workHandler;
  employeeHandler = employeeHandler;

  get employees() {
    return this.employeeHandler.employees;
  }

  getEmployeeWorks(id: number): IWorkDate[] {
    return this.workHandler.getEmployeeWorks(id, this.calendar.getMonthWorks());
  }

  getReadableWorksHours(id: number): string {
    return this.workHandler.getReadableWorksHours(this.getEmployeeWorks(id));
  }

  getSalary(employee: IEmployee): string {
    return this.workHandler.getSalary(
      this.getEmployeeWorks(employee.id || -1),
      employee
    );
  }

  getWeeks(): IWorkDate[][] {
    return this.workHandler.getWeeks(
      this.calendar.getMonth(),
      this.calendar.days,
      this.$store.state.employeeID
    );
  }

  getWeekSalary(week: IWorkDate[]): string {
    const employee = this.employees.find(
      (employee: IEmployee) => employee.id == this.$store.state.employeeID
    );
    return employee ? this.workHandler.getSalary(week, employee) : "";
  }
}
</script>

<style lang="scss">
.dashboard__title {
  font-size: 3em;
  font-family: "Berkshire Swash", cursive;
  margin-bottom: 1em;
}
</style>
