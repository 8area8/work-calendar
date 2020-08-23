<template>
  <section class="section">
    <div class="content">
      <ul id="morning-workers" class=""></ul>
      <ul id="evening-workers" class=""></ul>
      <b-field grouped>
        <b-field label="Nom" expanded>
          <b-input id="name-input" :value="salary.name"></b-input>
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
      <b-button type="is-success">Nouveau salarié</b-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { SalaryWorker } from '../models/worker'

export default Vue.extend({
  data() {
    return {
      salary: {
        id: null,
        name: '',
        preference: 'morning',
        salary: 10,
      } as SalaryWorker,
    }
  },
})
</script>
