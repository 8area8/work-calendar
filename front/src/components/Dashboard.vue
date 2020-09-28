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
                {{ getMonthSalary(employee) }}
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
                {{ getWeekTime(week) }}
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

  getMonthSalary(employee: IEmployee): string {
    return this.workHandler.getMonthSalary(
      this.getEmployeeWorks(employee.id || -1),
      employee
    );
  }

  getWeeks(): IWorkDate[][] {
    const month = this.calendar.getMonth();
    const weeks: IWorkDate[][] = [];

    this.calendar.days.forEach((day: IDay, index: number) => {
      if (index % 7 == 0) {
        weeks.push([]);
      }
      if (day.month === month) {
        const work = day.works.find((work: IWorkDate) => {
          return work.employee === this.$store.state.employeeID;
        });
        if (work) {
          weeks.slice(-1)[0].push(work);
        }
      }
    });
    return weeks;
  }

  getWeekHours(week: IWorkDate[]) {
    let seconds = 0;
    let hours = 0;
    let minutes = 0;

    for (const work of week) {
      seconds = (work.end.getTime() - work.start.getTime()) / 1000;
      minutes += seconds / 60;
    }
    hours = Math.floor(minutes / 60);
    minutes -= Math.floor(hours * 60);

    return { hours, minutes };
  }

  getWeekTime(week: IWorkDate[]): string {
    const time = this.getWeekHours(week);
    const twoDigits = time.minutes < 10 ? "0" + time.minutes : time.minutes;
    return `${time.hours}H${twoDigits}`;
  }

  getWeekSalary(week: IWorkDate[]): string {
    let salary = 0;
    const employee = this.employees.find(
      (employee: IEmployee) => employee.id == this.$store.state.employeeID
    );
    const baseNet = employee ? employee.salary : 0;
    const time = this.getWeekHours(week);

    salary = baseNet * time.hours;
    salary += (baseNet * time.minutes) / 60;
    return salary.toFixed(2);
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
