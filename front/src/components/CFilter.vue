<template>
  <div class="container box has-background-dark">
    <div class=" has-text-light filter__title">Filtrer</div>
    <b-field expanded>
      <b-select
        expanded
        placeholder="Filtrer par employé"
        v-model="filter"
        @input="emitValue"
      >
        <option :value="-1">Tous</option>
        <option
          v-for="employee in employees"
          :value="employee.id"
          :key="employee.id"
        >
          {{ employee.name }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const Props = Vue.extend({
  props: {
    employees: Array,
    value: Number,
  },
});

@Component
export default class CFilter extends Props {
  filter = -1;
  emitValue() {
    this.$emit("input", this.filter);
    console.log("value filter vaut", this.filter);
  }
}
</script>

<style lang="scss">
.filter__title {
  font-size: 3em;
  font-family: "Berkshire Swash", cursive;
}
</style>
