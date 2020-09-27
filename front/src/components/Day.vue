<template>
  <div class="modal is-clipped" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="$emit('close-modal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title is-size-3">{{ dayName }}</p>
      </header>
      <section class="modal-card-body">
        <DayWorksTable
          :employees="employees"
          :works="getWorksPreference('morning')"
          tableTitle="Matin"
          @modify="modify($event)"
          @delete="delete_($event)"
        />
        <DayWorksTable
          :employees="employees"
          :works="getWorksPreference('evening')"
          tableTitle="Soir"
          @modify="modify($event)"
          @delete="delete_($event)"
        />
        <DayAddWork
          v-if="auth.isAdmin"
          :employees="availableEmployees"
          :work="work"
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

import { ISalaryWorker } from "../clean_architecture/entities/worker";
import {
  IDay,
  IWork,
  IWorkDate,
} from "../clean_architecture/entities/calendar";

import { EmployeeInteractor } from "../clean_architecture/interactors/employee";
import { auth } from "../clean_architecture/services/auth";

const DayProps = Vue.extend({
  props: {
    isActive: Boolean,
    day: Object,
    employeesService: {
      type: Object as PropType<EmployeeInteractor>,
      required: true,
    },
    service: Object,
  },
  components: {
    DayWorksTable,
    DayAddWork,
  },
});

@Component
export default class Day extends DayProps {
  auth = auth;
  work = {
    day: null,
    employee: null,
    start: new Date(2020, 1, 1, 17),
    end: new Date(2020, 1, 2, 2),
  };

  get dayName() {
    const day = this.day;
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

  get employees(): ISalaryWorker[] {
    return this.employeesService.employees as ISalaryWorker[];
  }

  get availableEmployees(): ISalaryWorker[] {
    return this.employees.filter((employee: ISalaryWorker) => {
      return !this.day.works.find((work: IWorkDate) => {
        return work.employee === employee.id;
      });
    });
  }

  getWorksPreference(preference: string): IWorkDate[] {
    return this.day.works.filter((work: IWorkDate) => {
      const startHour = work.start.getHours();
      const dayHours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
      const nightHours = [17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4];
      return preference == "morning"
        ? dayHours.includes(startHour)
        : nightHours.includes(startHour);
    });
  }

  async create() {
    this.work.day = this.day?.id;
    const works = await this.service.add(this.work);
    this.day.works = works;
    this.$buefy.toast.open(`Horaires créés !`);
  }

  async modify(work: IWork) {
    const works = await this.service.modify(work);
    this.day.works = works;
    this.$buefy.toast.open(`L'horaire a bien été modifié !`);
  }

  delete_(work: IWork) {
    this.$buefy.dialog.confirm({
      title: `Supprimer l'horaire ?`,
      message: `Es-tu sûre de vouloir <b>supprimer</b> cet horaire ? Cette action est irréversible.`,
      confirmText: "Supprimer",
      type: "is-danger",
      hasIcon: true,
      onConfirm: () => {
        this.service
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
