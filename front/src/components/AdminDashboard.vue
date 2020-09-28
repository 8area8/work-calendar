<template>
  <div class="container has-text-centered box" style="margin-top: 1em">
    <div class="table-container">
      <div class="dashboard__title">Tableau de bord</div>
      <div v-if="filter === -1">
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
                {{ getTime(employee) }}
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
          {{ employees.find((elem) => elem.id == filter).name }}
          (salaire net horaire :
          {{ employees.find((elem) => elem.id == filter).salary }} euros)
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

import { WorkInteractor } from "../clean_architecture/interactors/work";
import { CalendarInteractor } from "../clean_architecture/interactors/calendar";

import { IEmployee } from "../clean_architecture/entities/worker";
import { IWorkDate, IDay } from "../clean_architecture/entities/calendar";

const Props = Vue.extend({
  props: {
    employees: { type: Array as PropType<IEmployee[]> },
    worksService: { type: Object as PropType<WorkInteractor> },
    calendar: { type: Object as PropType<CalendarInteractor> },
    filter: Number,
  },
});

@Component
export default class Dashboard extends Props {
  getMonthWorks(): IWorkDate[] {
    const onlyThisMonth = this.calendar.days.filter(
      (day: IDay) => day.month == this.calendar.getMonth()
    );
    const works = onlyThisMonth.map((day: IDay) => {
      return day.works;
    });
    const result = works.flat();
    return result;
  }

  getEmployeeWorks(employeeId: number): IWorkDate[] {
    const works = this.getMonthWorks().filter((work: IWorkDate) => {
      return work.employee == employeeId;
    });
    return works;
  }

  getTotalHours(employee: IEmployee) {
    let seconds = 0;
    let hours = 0;
    let minutes = 0;
    const works = this.getEmployeeWorks(employee.id || -1);

    for (const work of works) {
      seconds = (work.end.getTime() - work.start.getTime()) / 1000;
      minutes += seconds / 60;
    }
    hours = Math.floor(minutes / 60);
    minutes -= Math.floor(hours * 60);

    return { minutes, hours };
  }

  getTime(employee: IEmployee): string {
    const time = this.getTotalHours(employee);
    const twoDigits = time.minutes < 10 ? "0" + time.minutes : time.minutes;
    return `${time.hours}H${twoDigits}`;
  }

  getMonthSalary(employee: IEmployee): string {
    let salary = 0;
    const time = this.getTotalHours(employee);

    salary = employee.salary * time.hours;
    salary += (employee.salary * time.minutes) / 60;
    return salary.toFixed(2);
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
          return work.employee === this.filter;
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
      (employee: IEmployee) => employee.id == this.filter
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
