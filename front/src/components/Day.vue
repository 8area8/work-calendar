<template>
  <div class="modal is-clipped" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="$emit('close-modal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title is-size-3">{{ getDayName() }}</p>
      </header>
      <section class="modal-card-body">
        <WorksTable
          :employees="employees"
          :works="getWorksPreference('morning')"
          tableTitle="Matin"
          @modify="modify($event)"
          @delete="delete_($event)"
        />
        <WorksTable
          :employees="employees"
          :works="getWorksPreference('evening')"
          tableTitle="Soir"
          @modify="modify($event)"
          @delete="delete_($event)"
        />
        <div class="container" style="margin-top: 1.5em">
          <div class="table-container box">
            <div class="title is-size-4">
              Ajouter un employé
            </div>
            <table class="table is-striped">
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
                    <b-button outlined type="is-info" @click="create(work)"
                      >Ajouter</b-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
import { ISalaryWorker } from "../clean_architecture/entities/worker";
import {
  IDay,
  IWork,
  IWorkDate,
} from "../clean_architecture/entities/calendar";
import { EmployeeInteractor } from "../clean_architecture/interactors/employee";
import WorksTable from "./WorksTable.vue";

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
    WorksTable,
  },
});

@Component
export default class Day extends DayProps {
  work = {
    day: null,
    employee: null,
    start: new Date(2020, 1, 1, 17),
    end: new Date(2020, 1, 2, 2),
  };

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

  getAvailableEmployeesPreference(preference: string): ISalaryWorker[] {
    return this.availableEmployees.filter((employee: ISalaryWorker) => {
      return employee.preference == preference;
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

  getDayName() {
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

  getTotalHours() {
    const startDate = this.work.start;
    const endDate = new Date(this.work.end.getTime());

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

  async create(work: IWork) {
    work.day = this.day?.id;
    const works = await this.service.add(work);
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
