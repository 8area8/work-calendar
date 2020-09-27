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
        @month-change="isCalendarVisible = calendarService.isVisible()"
      />
    </section>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

import Calendar from "../components/Calendar";
import CFilter from "../components/CFilter";

import { EmployeeInteractor } from "../clean_architecture/interactors/employee";
import { CalendarInteractor } from "../clean_architecture/interactors/calendar";
import { WorkInteractor } from "../clean_architecture/interactors/work";

@Component({
  components: {
    Calendar,
    CFilter,
  },
})
export default class Index extends Vue {
  name = "HomePage";
  employeeID = -1;
  employeesService = new EmployeeInteractor();
  calendarService = new CalendarInteractor();
  workService = new WorkInteractor();
  isCalendarVisible = this.calendarService.isVisible();

  async mounted() {
    await this.employeesService.get();
  }
}
</script>

<style lang="scss">
.message {
  margin-bottom: 1em;
}
</style>
