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
              {{ employeeHandler.find(work.employee).name }}
            </td>
            <td style="vertical-align: middle;">
              <b-timepicker
                v-if="auth.isAdmin"
                v-model="work.start"
                inline
              ></b-timepicker>
              <div v-else>{{ workHandler.getTime(work.start) }}</div>
            </td>
            <td style="vertical-align: middle;">
              <b-timepicker
                v-if="auth.isAdmin"
                v-model="work.end"
                inline
              ></b-timepicker>
              <div v-else>{{ workHandler.getTime(work.end) }}</div>
            </td>
            <td class="total-hours" style="vertical-align: middle;">
              {{ workHandler.getTotalHours(work.start, work.end) }}
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
import { employeeHandler } from "../clean_architecture/interactors/employee";
import { workHandler } from "../clean_architecture/interactors/work";

const Props = Vue.extend({
  props: {
    works: { type: Array as PropType<IWorkDate[]> },
    tableTitle: String,
  },
});

@Component
export default class DayWorksTable extends Props {
  workHandler = workHandler;
  employeeHandler = employeeHandler;
  auth = auth;
}
</script>

<style></style>
