<template>
  <div class="container" style="margin-top: 1em">
    <div class="table-container box">
      <div class="title is-size-4">
        {{ tableTitle }}
      </div>
      <table class="table is-striped" v-if="works.length">
        <thead>
          <tr>
            <th>Employé</th>
            <th><abbr>Début</abbr></th>
            <th><abbr>Fin</abbr></th>
            <th><abbr>Total</abbr></th>
            <th><abbr>Modifier</abbr></th>
            <th><abbr>Suprimer</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in works" :key="'work-' + work.id">
            <td style="vertical-align: middle;">
              {{ getEmployeeName(work.employee) }}
            </td>
            <td style="vertical-align: middle;">
              <b-timepicker v-model="work.start" inline></b-timepicker>
            </td>
            <td style="vertical-align: middle;">
              <b-timepicker v-model="work.end" inline></b-timepicker>
            </td>
            <td class="total-hours" style="vertical-align: middle;">
              {{ getTotalHours(work.start, work.end) }}
            </td>
            <td class="has-text-centered" style="vertical-align: middle;">
              <b-button
                expanded
                outlined
                type="is-info"
                @click="$emit('modify', work)"
                >Modifier</b-button
              >
            </td>
            <td class="has-text-centered" style="vertical-align: middle;">
              <b-button
                type="is-danger"
                expanded
                outlined
                @click="$emit('delete', work)"
                >Supprimer</b-button
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { PropType } from "vue";
import { ISalaryWorker } from "../clean_architecture/entities/worker";
import { IWorkDate } from "../clean_architecture/entities/calendar";

const Props = Vue.extend({
  props: {
    employees: { type: Array as PropType<ISalaryWorker[]> },
    works: { type: Array as PropType<IWorkDate[]> },
    tableTitle: String,
  },
});

@Component
export default class WorksTable extends Props {
  getEmployeeName(id: number) {
    const employee = this.employees.find(
      (employee: ISalaryWorker) => employee.id == id
    );
    return employee?.name;
  }

  getTotalHours(start: Date, end: Date) {
    end = new Date(end.getTime());
    if (end.getHours() > 6) {
      end.setDate(start.getDate());
    } else if (end.getHours() < 6) {
      end.setDate(start.getDate() + 1);
    }

    let milliseconds = end.getTime() - start.getTime();

    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    milliseconds -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(milliseconds / 1000 / 60);
    const twoDigits = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}H${twoDigits}`;
  }
}
</script>

<style></style>
