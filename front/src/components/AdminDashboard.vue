<template>
  <div class="container has-text-centered box" style="margin-top: 1em">
    <div class="table-container">
      <div class="dashboard__title">Tableau de bord</div>
      <table
        v-if="filter === -1"
        class="table is-bordered is-striped"
        style="margin: auto; margin-top: 1em"
      >
        <thead>
          <tr>
            <th>Employé</th>
            <th><abbr>Jours travaillés</abbr></th>
            <th><abbr>Total heures</abbr></th>
            <th><abbr>Salaire net à l'heure</abbr></th>
            <th><abbr>Salaire au mois</abbr></th>
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
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Component, Vue } from "vue-property-decorator";

import { WorkInteractor } from "../clean_architecture/interactors/work";
import { CalendarInteractor } from "../clean_architecture/interactors/calendar";

import { ISalaryWorker } from "../clean_architecture/entities/worker";
import { IWorkDate, IDay } from "../clean_architecture/entities/calendar";

const Props = Vue.extend({
  props: {
    employees: { type: Array as PropType<ISalaryWorker[]> },
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
    console.log("dashboard works:", works);
    return works;
  }

  getTotalHours(employee: ISalaryWorker) {
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

  getTime(employee: ISalaryWorker): string {
    const time = this.getTotalHours(employee);
    const twoDigits = time.minutes < 10 ? "0" + time.minutes : time.minutes;
    return `${time.hours}H${twoDigits}`;
  }

  getMonthSalary(employee: ISalaryWorker): string {
    let salary = 0;
    const time = this.getTotalHours(employee);

    salary = employee.salary * time.hours;
    salary += (employee.salary * time.minutes) / 60;
    return salary.toFixed(2);
  }

  mounted() {
    // this.getMonthWorks();
  }
}
</script>

<style lang="scss">
.dashboard__title {
  font-size: 3em;
  font-family: "Berkshire Swash", cursive;
}
</style>
