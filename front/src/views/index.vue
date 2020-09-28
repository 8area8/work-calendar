<template>
  <div class="back-image back-image--full">
    <section class="section">
      <!-- MESSAGE -->
      <div
        class="container message"
        :class="{ 'is-invisible': isCalendarVisible }"
      >
        <b-message
          title="Attention"
          type="is-warning"
          :closable="false"
          size="is-small"
        >
          {{ calendar.overLimitMessage }}
        </b-message>
      </div>

      <CFilter />
      <Calendar @month-change="updateCalendar()" />
      <Dashboard v-if="auth.isAdmin" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Calendar from "../components/Calendar.vue";
import CFilter from "../components/CFilter.vue";
import Dashboard from "../components/Dashboard.vue";

import { employeeHandler } from "../clean_architecture/interactors/employee";
import { calendarHandler } from "../clean_architecture/interactors/calendar";
import { auth } from "../clean_architecture/services/auth";

@Component({
  components: {
    Calendar,
    CFilter,
    Dashboard,
  },
})
export default class Index extends Vue {
  name = "HomePage";
  auth = auth;

  calendar = calendarHandler;
  isCalendarVisible = calendarHandler.isVisible();

  async mounted() {
    await employeeHandler.get();
    console.log("Employees are", employeeHandler.employees);
  }

  updateCalendar() {
    this.isCalendarVisible = calendarHandler.isVisible();
  }
}
</script>

<style lang="scss">
.message {
  margin-bottom: 1em;
}
</style>
