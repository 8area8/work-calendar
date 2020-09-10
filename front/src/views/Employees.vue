<template>
  <section class="section back-image back-image--full">
    <div class="content container">
      <div class="box" v-if="hasEmployees()">
        <div v-if="getMorningEmployees().length">
          <div class="title">Matin</div>
          <ul id="morning-workers" class=""></ul>
        </div>
        <div v-if="getEveningEmployees().length">
          <div class="title">Soir</div>
          <ul id="evening-workers" class=""></ul>
        </div>
      </div>

      <!-- FIELDS -->
      <div class="box has-text-centered">
        <div class="title">Créer un employée</div>
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
        <b-button id="create-worker" type="is-primary"
          >Nouveau salarié</b-button
        >
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ISalaryWorker } from "../clean_architecture/entities/worker";

@Component
export default class Employees extends Vue {
  firstInput = false;
  employee = {
    id: null,
    name: "",
    preference: "morning",
    salary: 10
  } as ISalaryWorker;
  employees: ISalaryWorker[] = [];

  hasError(): boolean {
    return this.employee.name.length < 3 && this.firstInput;
  }

  getMorningEmployees(): ISalaryWorker[] {
    return [];
  }
  getEveningEmployees(): ISalaryWorker[] {
    return [];
  }

  hasEmployees(): boolean {
    return this.employees.length > 0;
  }
}
</script>
