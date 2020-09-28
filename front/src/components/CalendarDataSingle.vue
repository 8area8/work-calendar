<template>
  <div>
    <span
      class="c-day__employee-number"
      :class="{
        'is-invisible': !work,
      }"
    >
      {{ work ? workHandler.getWorkingTime(work.start, work.end) : "No value" }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PropType } from "vue";

import { IWorkDate } from "../clean_architecture/entities/calendar";

import { workHandler } from "../clean_architecture/interactors/work";

const Props = Vue.extend({
  props: {
    work: Object as PropType<IWorkDate>,
  },
});

export default class CalendarDataSingle extends Props {
  workHandler = workHandler;
}
</script>

<style></style>
