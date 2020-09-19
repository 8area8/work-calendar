<template>
  <section class="section back-image back-image--full">
    <div class="content container">
      <div class="box" v-if="hasEmployees()">
        <div v-if="getMorningEmployees().length">
          <div class="title">Matin</div>
          <ul id="morning-workers" class="">
            <li v-for="employee in getMorningEmployees()" :key="employee.id">
              {{employee.name}}
            </li>
          </ul>
        </div>
        <div v-if="getEveningEmployees().length">
          <div class="title">Soir</div>
          <ul id="evening-workers" class=""></ul>
        </div>
      </div>

      <!-- FIELDS -->
      <div class="container">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title title card-header-title--centered">
              Créer un employé
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="notification is-notification--light">
                <strong>Note :</strong> Le nouvel employé doit posséder un nom,
                une préférence d'horaires et un salaire net par heure.
              </div>
              <!-- NAME -->
              <b-field
                label="Nom"
                position="is-centered"
                :type="{ 'is-danger': hasError() }"
                :message="{
                  'Le nom doit contenir au moins 3 caractères.': hasError()
                }"
              >
                <b-input
                  id="name-input"
                  @input="firstInput = true"
                  v-model="employee.name"
                  maxlength="30"
                ></b-input>
              </b-field>
              <!-- PREFERENCE -->
              <b-field label="Préférence" position="is-centered">
                <b-select
                  class="has-text-centered"
                  id="preference-input"
                  v-model="employee.preference"
                >
                  <option value="morning">matin</option>
                  <option value="evening">soir</option>
                </b-select>
              </b-field>
              <!-- SALARY -->
              <b-field
                label="Salaire net/heure"
                position="is-centered"
                class="has-text-centered"
              >
                <b-numberinput
                  class="has-text-centered"
                  style="justify-content: center;"
                  id="salary-input"
                  v-model="employee.salary"
                  controls-position="compact"
                  max="30"
                  min="1"
                  type="is-dark"
                ></b-numberinput>
              </b-field>
              <b-button
                id="create-worker"
                type="is-primary"
                :disabled="this.employee.name.length < 3"
                @click="service.add(employee)"
              >
                Nouvel employé
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ISalaryWorker } from "../clean_architecture/entities/worker";
import { EmployeeInteractor } from "../clean_architecture/interactors/employee";

@Component
export default class Employees extends Vue {
  service = new EmployeeInteractor();

  firstInput = false;
  employee = {
    id: null,
    name: "",
    preference: "morning",
    salary: 10,
  } as ISalaryWorker;

  hasError(): boolean {
    return this.employee.name.length < 3 && this.firstInput;
  }

  getMorningEmployees(): ISalaryWorker[] {
    return this.service.employees;
  }
  getEveningEmployees(): ISalaryWorker[] {
    return [];
  }

  hasEmployees(): boolean {
    return this.service.employees.length > 0;
  }

  async mounted() {
    this.service.employees = await this.service.get();
  }
}
</script>

<style lang="scss">
.card-header-title--centered {
  justify-content: center;
  // background: url("../assets/andrea-riezzo--glass.jpg") no-repeat center center
  //   fixed;
  // background-size: cover;
  // height: 5em;
  // color: black;
}

.is-notification--light {
  background-color: #fff5c1;
  color: #7b6229;
}
</style>
