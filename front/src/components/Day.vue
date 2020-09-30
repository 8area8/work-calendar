<template>
  <div class="modal is-clipped" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="$emit('close-modal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title is-size-3">{{ dayName }}</p>
      </header>
      <section class="modal-card-body">
        <DayWorksTable
          :works="morningWorks"
          tableTitle="Matin"
          @modify="modify($event)"
          @delete="delete_($event)"
        />
        <DayWorksTable
          :works="eveningWorks"
          tableTitle="Soir"
          @modify="modify($event)"
          @delete="delete_($event)"
        />
        <DayAddWork
          v-if="auth.isAdmin"
          :employees="availableEmployees"
          :work="work"
          :weekDay="getWeekDay()"
          @create="create()"
        />
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="$emit('close-modal')">
          Fermer
        </button>
      </footer>
    </div>

    <button
      class="modal-close is-large"
      aria-label="close"
      @click="$emit('close-modal')"
    ></button>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import DayWorksTable from "./DayWorksTable.vue";
import DayAddWork from "./DayAddWork.vue";

import { IEmployee } from "../clean_architecture/entities/worker";
import {
  IDay,
  IWork,
  IWorkDate,
} from "../clean_architecture/entities/calendar";

import { employeeHandler } from "../clean_architecture/interactors/employee";
import { calendarHandler } from "../clean_architecture/interactors/calendar";
import { workHandler } from "../clean_architecture/interactors/work";
import { auth } from "../clean_architecture/services/auth";

const DayProps = Vue.extend({
  props: {
    isActive: Boolean,
    day: { type: Object as PropType<IDay> },
  },
  components: {
    DayWorksTable,
    DayAddWork,
  },
});

@Component
export default class Day extends DayProps {
  employeeHandler = employeeHandler;
  workHandler = workHandler;
  calendarHandler = calendarHandler;
  auth = auth;

  work = {
    id: null,
    day: null,
    employee: null,
    start: new Date(2020, 1, 1, 17),
    end: new Date(2020, 1, 2, 2),
  } as IWorkDate;

  get dayName(): string {
    const day = this.day;
    if (!day) {
      return "";
    }
    return this.calendarHandler.getLongDayName(day);
  }

  get employees(): IEmployee[] {
    return this.employeeHandler.employees as IEmployee[];
  }

  get availableEmployees(): IEmployee[] {
    return this.employeeHandler.getAvailableEmployees(
      this.employees,
      this.day.works
    );
  }

  get morningWorks() {
    return this.workHandler.getWorksPreference(this.day.works, "morning");
  }

  get eveningWorks() {
    return this.workHandler.getWorksPreference(this.day.works, "evening");
  }

  getWeekDay(): string {
    const date = new Date(this.day.year, this.day.month, this.day.number);
    return this.calendarHandler.getWeekDay(date);
  }

  async create() {
    this.work.day = this.day.id || -1;
    const works = await workHandler.add(this.work);
    this.day.works = works;
    this.$buefy.toast.open(`Horaires créés !`);
  }

  async modify(work: IWorkDate) {
    const works = await workHandler.modify(work);
    this.day.works = works;
    this.$buefy.toast.open(`L'horaire a bien été modifié !`);
  }

  delete_(work: IWorkDate) {
    this.$buefy.dialog.confirm({
      title: `Supprimer l'horaire ?`,
      message: `Es-tu sûre de vouloir <b>supprimer</b> cet horaire ? Cette action est irréversible.`,
      confirmText: "Supprimer",
      type: "is-danger",
      hasIcon: true,
      onConfirm: () => {
        workHandler
          .delete_(work)
          .then((res: IWorkDate[]) => (this.day.works = res));
        this.$buefy.toast.open(`L'horaire est supprimé !`);
      },
    });
  }
}
</script>

<style lang="scss">
.line {
  display: flex;
  justify-content: space-evenly;
  text-align: center;
}
.total-hours {
  color: #363636;
  font-weight: 600;
  padding: 0.3em;
}
</style>
