<template>
  <div>
    <span
      class="c-day__employee-number"
      :class="{
        'is-invisible': !work,
      }"
    >
      {{ work ? getWorkingTime() : "No value" }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PropType } from "vue";

import { IWorkDate } from "../clean_architecture/entities/calendar";

const Props = Vue.extend({
  props: {
    work: Object as PropType<IWorkDate>,
  },
});

export default class CalendarDataSingle extends Props {
  getTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const twoDigits = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}H${twoDigits}`;
  }

  getWorkingTime() {
    return `${this.getTime(this.work.start)} - ${this.getTime(this.work.end)}`;
  }
}
</script>

<style></style>
