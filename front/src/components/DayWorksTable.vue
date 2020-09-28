<template>
  <div class="container" style="margin-top: 1em">
    <div class="table-container box">
      <div class="title is-size-4">
        {{ tableTitle }}
      </div>
      <table
        class="table is-fullwidth is-bordered is-striped"
        v-if="works.length"
      >
        <thead>
          <tr>
            <th>Employé</th>
            <th><abbr>Début</abbr></th>
            <th><abbr>Fin</abbr></th>
            <th><abbr>Total</abbr></th>
            <th v-if="auth.isAdmin"><abbr>Enregistrer</abbr></th>
            <th v-if="auth.isAdmin"><abbr>Suprimer</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in works" :key="'work-' + work.id">
            <td style="vertical-align: middle;">
              {{ getEmployeeName(work.employee) }}
            </td>
            <td style="vertical-align: middle;">
              <b-timepicker
                v-if="auth.isAdmin"
                v-model="work.start"
                inline
              ></b-timepicker>
              <div v-else>{{ getTime(work.start) }}</div>
            </td>
            <td style="vertical-align: middle;">
              <b-timepicker
                v-if="auth.isAdmin"
                v-model="work.end"
                inline
              ></b-timepicker>
              <div v-else>{{ getTime(work.end) }}</div>
            </td>
            <td class="total-hours" style="vertical-align: middle;">
              {{ getTotalHours(work.start, work.end) }}
            </td>
            <td
              class="has-text-centered"
              style="vertical-align: middle;"
              v-if="auth.isAdmin"
            >
              <b-button
                expanded
                outlined
                type="is-info"
                @click="$emit('modify', work)"
                >Enregistrer</b-button
              >
            </td>
            <td
              class="has-text-centered"
              style="vertical-align: middle;"
              v-if="auth.isAdmin"
            >
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
import { IEmployee } from "../clean_architecture/entities/worker";
import { IWorkDate } from "../clean_architecture/entities/calendar";
import { auth } from "../clean_architecture/services/auth";

const Props = Vue.extend({
  props: {
    employees: { type: Array as PropType<IEmployee[]> },
    works: { type: Array as PropType<IWorkDate[]> },
    tableTitle: String,
  },
});

@Component
export default class DayWorksTable extends Props {
  auth = auth;
  getEmployeeName(id: number): string {
    const employee = this.employees.find(
      (employee: IEmployee) => employee.id == id
    );
    return employee ? employee.name : "";
  }

  getTotalHours(start: Date, end: Date): string {
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

  getTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const twoDigits = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}H${twoDigits}`;
  }
}
</script>

<style></style>
