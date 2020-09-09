<template>
  <section class="section">
    <div class="content">
      <ul id="morning-workers" class=""></ul>
      <ul id="evening-workers" class=""></ul>
      <b-field
        label="Nom"
        :type="{ 'is-danger': hasError() }"
        :message="{
          'Le nom doit contenir au moins 3 caractères.': hasError()
        }"
      >
        <b-input id="name-input" v-model="salary.name" maxlength="30"></b-input>
      </b-field>
      <b-field label="Préférence">
        <b-select id="preference-input" v-model="salary.preference">
          <option value="morning">matin</option>
          <option value="evening">soir</option>
        </b-select>
      </b-field>
      <b-field label="Salaire net/heure">
        <b-numberinput
          id="salary-input"
          v-model="salary.salary"
          controls-position="compact"
          max="30"
          min="1"
          type="is-dark"
        ></b-numberinput>
      </b-field>
      <b-button id="create-worker" type="is-success">Nouveau salarié</b-button>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ISalaryWorker } from "../clean_architecture/entities/worker";

@Component
export default class Employees extends Vue {
  salary = {
    id: null,
    name: "",
    preference: "morning",
    salary: 10
  } as ISalaryWorker;

  hasError() {
    return this.salary.name.length < 3;
  }
}
</script>
