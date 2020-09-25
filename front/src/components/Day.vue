<template>
  <div class="modal is-clipped" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="$emit('close-modal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ getDayName() }}</p>
      </header>
      <section class="modal-card-body">
        <div class="container">
          <div class="title">
            Liste des horaires
          </div>
          <div class="table-container box" v-if="service.works.length">
            <table class="table is-striped">
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
                <tr v-for="work in day.works" :key="'work-' + work.id">
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
                      @click="modify(work)"
                      >Modifier</b-button
                    >
                  </td>
                  <td class="has-text-centered" style="vertical-align: middle;">
                    <b-button
                      type="is-danger"
                      expanded
                      outlined
                      @click="delete_(work)"
                      >Supprimer</b-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="title">
            Créer un horaire
          </div>
          <div class="table-container box">
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
                    >
                      <option
                        v-for="employee in employeesService.employees"
                        :key="'select-employee' + employee.id"
                        :value="employee.id"
                        >{{ employee.name }}</option
                      >
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { ISalaryWorker } from "../clean_architecture/entities/worker";
import { IDay, IWork } from "../clean_architecture/entities/calendar";

const DayProps = Vue.extend({
  props: {
    isActive: Boolean,
    day: Object,
    employeesService: Object,
    service: Object,
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

  getTotalHours(start?: Date, end?: Date) {
    const startDate = start ? new Date(start) : this.work.start;
    const endDate = end ? new Date(end) : new Date(this.work.end.getTime());

    if (endDate.getHours() > 6) {
      endDate.setDate(endDate.getDate() - 1);
    }
    let milliseconds = endDate.getTime() - startDate.getTime();

    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    milliseconds -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(milliseconds / 1000 / 60);
    const twoDigits = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}H${twoDigits}`;
  }

  getEmployeeName(id: number) {
    return this.employeesService.employees.find(
      (employee: ISalaryWorker) => employee.id == id
    )?.name;
  }

  create(work: IWork) {
    work.day = this.day?.id;
    console.log("avant le drame", work);
    const works = this.service.add(work);
    this.day.works = works;
    this.$buefy.toast.open(`Horaires créés !`);
  }

  modify(work: IWork) {
    const works = this.service.modify(work);
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
        this.service.delete_(work);
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
