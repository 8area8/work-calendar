<template>
  <div class="container" style="margin-top: 1.5em">
    <div class="table-container box">
      <div class="title is-size-4">
        Ajouter un employé
      </div>
      <table class="table is-fullwidth is-bordered is-striped">
        <thead>
          <tr>
            <th>Employé</th>
            <th><abbr>Début</abbr></th>
            <th><abbr>Fin</abbr></th>
            <th><abbr>Total</abbr></th>
            <th><abbr>Ajouter</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="vertical-align: middle;">
              <b-select
                class="has-text-centered"
                id="preference-input"
                v-model="work.employee"
                label="Grouped"
              >
                <optgroup label="Matin">
                  <option
                    v-for="employee in employeeHandler.filterEmployeesFromPreference(
                      employees,
                      'morning',
                      weekDay
                    )"
                    :key="'select-employee' + employee.id"
                    :value="employee.id"
                    >{{ employee.name }}</option
                  >
                </optgroup>
                <optgroup label="Soir">
                  <option
                    v-for="employee in employeeHandler.filterEmployeesFromPreference(
                      employees,
                      'evening',
                      weekDay
                    )"
                    :key="'select-employee' + employee.id"
                    :value="employee.id"
                    >{{ employee.name }}</option
                  >
                </optgroup>
                <optgroup label="Off">
                  <option
                    class="has-text-grey-light"
                    v-for="employee in employeeHandler.getOffEmployees(
                      employees,
                      weekDay
                    )"
                    :key="'select-employee' + employee.id"
                    :value="employee.id"
                    >{{ employee.name }}</option
                  >
                </optgroup>
              </b-select>
            </td>
            <td style="vertical-align: middle;">
              <b-timepicker v-model="work.start" inline></b-timepicker>
            </td>
            <td style="vertical-align: middle;">
              <b-timepicker v-model="work.end" inline></b-timepicker>
            </td>
            <td style="vertical-align: middle;">
              <div class="total-hours">
                {{ workHandler.getTotalHours(work.start, work.end) }}
              </div>
            </td>
            <td style="vertical-align: middle;">
              <b-button outlined type="is-info" @click="$emit('create')"
                >Ajouter</b-button
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

import { workHandler } from "../clean_architecture/interactors/work";
import { employeeHandler } from "../clean_architecture/interactors/employee";

const Props = Vue.extend({
  props: {
    employees: { type: Array as PropType<IEmployee[]> },
    work: { type: Object as PropType<IWorkDate> },
    weekDay: String,
  },
});

@Component
export default class DayWorksTable extends Props {
  workHandler = workHandler;
  employeeHandler = employeeHandler;
}
</script>

<style></style>
