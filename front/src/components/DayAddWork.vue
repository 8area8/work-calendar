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
                    v-for="employee in getAvailableEmployeesPreference(
                      'morning'
                    )"
                    :key="'select-employee' + employee.id"
                    :value="employee.id"
                    >{{ employee.name }}</option
                  >
                </optgroup>
                <optgroup label="Soir">
                  <option
                    v-for="employee in getAvailableEmployeesPreference(
                      'evening'
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
                {{ getTotalHours() }}
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
import { ISalaryWorker } from "../clean_architecture/entities/worker";
import { IWorkDate } from "../clean_architecture/entities/calendar";

const Props = Vue.extend({
  props: {
    employees: { type: Array as PropType<ISalaryWorker[]> },
    work: { type: Object as PropType<IWorkDate> },
  },
});

@Component
export default class DayWorksTable extends Props {
  getTotalHours() {
    const startDate = this.work.start;
    const endDate = this.work.end;

    if (endDate.getHours() > 6) {
      endDate.setDate(startDate.getDate());
    } else if (endDate.getHours() < 6) {
      endDate.setDate(startDate.getDate() + 1);
    }
    let milliseconds = endDate.getTime() - startDate.getTime();

    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    milliseconds -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(milliseconds / 1000 / 60);
    const twoDigits = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}H${twoDigits}`;
  }

  getAvailableEmployeesPreference(preference: string): ISalaryWorker[] {
    return this.employees.filter((employee: ISalaryWorker) => {
      return employee.preference == preference;
    });
  }
}
</script>

<style></style>
