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
          {{ calendarService.overLimitMessage }}
        </b-message>
      </div>

      <CFilter :employees="employeesService.employees" v-model="employeeID" />
      <Calendar
        :calendar="calendarService"
        :employeesService="employeesService"
        :workService="workService"
        :filter="employeeID"
        @month-change="updateCalendar()"
      />
      <Dashboard
        v-if="auth.isAdmin"
        :workService="workService"
        :employees="employeesService.employees"
        :calendar="calendarService"
        :filter="employeeID"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Calendar from "../components/Calendar.vue";
import CFilter from "../components/CFilter.vue";
import Dashboard from "../components/AdminDashboard.vue";

import { EmployeeInteractor } from "../clean_architecture/interactors/employee";
import { CalendarInteractor } from "../clean_architecture/interactors/calendar";
import { WorkInteractor } from "../clean_architecture/interactors/work";
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
  employeeID = -1;
  auth = auth;
  employeesService = new EmployeeInteractor();
  calendarService = new CalendarInteractor();
  workService = new WorkInteractor();
  isCalendarVisible = this.calendarService.isVisible();

  async mounted() {
    await this.employeesService.get();
    console.log("Employees are", this.employeesService.employees);
  }

  updateCalendar() {
    this.isCalendarVisible = this.calendarService.isVisible();
    this.$forceUpdate();
  }
}
</script>

<style lang="scss">
.message {
  margin-bottom: 1em;
}
</style>
