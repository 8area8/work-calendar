<template>
  <section class="section">
    <div class="content">
      <ul id="morning-workers" class=""></ul>
      <ul id="evening-workers" class=""></ul>
      <b-field grouped>
        <b-field
          label="Nom"
          expanded
          :type="{ 'is-danger': hasError() }"
          :message="{
            'Le nom doit contenir au moins 3 caractères.': hasError()
          }"
        >
          <b-input
            id="name-input"
            v-model="salary.name"
            maxlength="30"
          ></b-input>
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
      </b-field>
      <b-button id="create-worker" type="is-success">Nouveau salarié</b-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { SalaryWorker } from "../clean_architecture/entities/worker";

export default Vue.extend({
  data() {
    return {
      salary: {
        id: null,
        name: "",
        preference: "morning",
        salary: 10
      } as SalaryWorker
    };
  },
  methods: {
    hasError() {
      return this.salary.name.length < 3;
    }
  }
});
</script>
