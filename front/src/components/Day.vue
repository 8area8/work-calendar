<template>
  <div class="modal is-clipped" :class="{ 'is-active': dayModale.isActive }">
    <div class="modal-background" @click="dayModale.isActive = false"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ getDayName() }}</p>
      </header>
      <section class="modal-card-body">
        <div class="container">
          <div class="line">
            <b-select
              class="has-text-centered"
              id="preference-input"
              v-model="work.employeeId"
            >
              <option
                v-for="employee in employees"
                :key="'select-employee' + employee.id"
                :value="employee.id"
                >{{ employee.name }}</option
              >
            </b-select>
            <b-numberinput
              v-model="work.start"
              controls-position="compact"
              class="bulma-control--nomargin"
              max="30"
              min="1"
              type="is-info"
            ></b-numberinput>
            <b-numberinput
              v-model="work.end"
              controls-position="compact"
              class="bulma-control--nomargin"
              max="30"
              min="1"
              type="is-info"
            ></b-numberinput>
            <b-button outlined type="is-info">Ajouter</b-button>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </footer>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="dayModale.isActive = false"
    ></button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ISalaryWorker } from "../clean_architecture/entities/worker";
import { IDay, IWork } from "../clean_architecture/entities/calendar";
import { EmployeeInteractor } from "../clean_architecture/interactors/employee";

export interface IDayModale {
  isActive: boolean;
  day: IDay | null;
}

const DayProps = Vue.extend({
  props: {
    dayModale: Object,
  },
});

@Component
export default class Day extends DayProps {
  service = new EmployeeInteractor();
  employees: ISalaryWorker[] = [];
  work = {
    employeeId: null,
    start: 12,
    end: 21,
  };

  async mounted() {
    this.employees = await this.service.get();
  }

  getDayName() {
    const day = this.dayModale.day;
    if (!day) {
      return "";
    }
    const date = new Date(day.year, day.month, day.number);
    const dayName = date.toLocaleDateString("default", {
      weekday: "long",
    });
    const monthName = date.toLocaleDateString("default", {
      month: "long",
    });
    return `${dayName} ${day.number} ${monthName}`;
  }
}
</script>

<style lang="scss">
.line {
  display: flex;
  justify-content: space-evenly;
  text-align: center;
}
</style>
