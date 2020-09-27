<template>
  <div id="calendar" class="">
    <div class="container">
      <!-- CALENDAR -->
      <div id="work-calendar" class="c-work-calendar">
        <!-- HEADER -->
        <div class="c-work-calendar__header">
          <!-- MONTH -->
          <div class="c-work-calendar__month">
            <div
              id="month-chevron-left"
              class="is-flex is-pointer"
              @click="setMonth(-1)"
            >
              <b-icon
                pack="fas"
                icon="chevron-left"
                size="is-small"
                class="has-text-grey"
              />
            </div>
            <span id="calendar-month-name">
              {{ monthName }}
            </span>
            <div
              id="month-chevron-right"
              class="is-flex is-pointer"
              @click="setMonth(1)"
            >
              <b-icon
                pack="fas"
                icon="chevron-right"
                size="is-small"
                class="has-text-grey"
              />
            </div>
          </div>
          <!-- YEAR -->
          <div class="c-work-calendar__year">
            <span id="calendar-year">
              {{ calendar.getYear() }}
            </span>
          </div>
        </div>
        <!-- CONTENT -->
        <div class="c-work-calendar__content">
          <!-- DAYS NAMES -->
          <div class="c-nodes c-nodes--title">
            <div
              v-for="(name, index) of calendar.getWeekDayNames()"
              :key="`dayName-${index}`"
              class="c-nodes__node c-nodes__node--day-name"
            >
              {{ name }}
            </div>
          </div>
          <!-- DAYS NODES -->
          <div class="c-nodes">
            <div
              @click="openDayModale(day)"
              v-for="(day, index) in days"
              :id="calendar.getStringDate(day)"
              :key="`day-${index}`"
              class="c-nodes__node c-day"
              :class="{
                'c-day--out-of-month': !calendar.isInMonth(day),
                'c-day--active': calendar.isActiveDay(day),
                'c-day--disabled': calendar.isOverDatabaseLimit(day),
              }"
            >
              <b-tooltip :label="getDayTooltip(day)" multilined type="is-dark">
                <div
                  class="c-day__data-wrapper"
                  :class="{ 'is-invisible': calendar.isOverDatabaseLimit(day) }"
                >
                  <div
                    class="c-day__number"
                    :class="{
                      'c-day__number--disabled': !calendar.isInMonth(day),
                    }"
                  >
                    {{ day.number }}
                  </div>
                  <div class="c-day__data">
                    <CalendarDataAll
                      v-if="filter === -1"
                      :eveningWorks="getWorksPreference(day.works, 'evening')"
                      :morningWorks="getWorksPreference(day.works, 'morning')"
                    />
                  </div>
                </div>
              </b-tooltip>
            </div>
            <!-- AFTER DAY -->
          </div>
        </div>
      </div>
    </div>
    <Day
      ref="day"
      :isActive="isModalActive"
      :day="modalDay"
      :employeesService="employeesService"
      :service="workService"
      @close-modal="isModalActive = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PropType } from "vue";
import CalendarDataAll from "./CalendarDataAll.vue";
import Day from "./Day.vue";

import { IDay, IWorkDate } from "../clean_architecture/entities/calendar";
import { ISalaryWorker } from "../clean_architecture/entities/worker";

import { CalendarInteractor } from "../clean_architecture/interactors/calendar";
import { EmployeeInteractor } from "../clean_architecture/interactors/employee";
import { WorkInteractor } from "../clean_architecture/interactors/work";

const Props = Vue.extend({
  props: {
    employeesService: { type: Object as PropType<EmployeeInteractor> },
    calendar: { type: Object as PropType<CalendarInteractor> },
    workService: { type: Object as PropType<WorkInteractor> },
    filter: Number,
  },
});

@Component({
  components: {
    Day,
    CalendarDataAll,
  },
})
export default class Calendar extends Props {
  days: IDay[] = [];
  monthName = "";
  modalDay: IDay = { works: [], id: null, number: 0, month: 0, year: 0 };
  isModalActive = false;

  openDayModale(day: IDay) {
    this.isModalActive = true;
    this.modalDay = day;
  }

  async getDays() {
    this.days = await this.calendar.getDays();
  }

  setMonth(difference: number) {
    this.calendar.setMonth(difference);
    this.getMonthName();
    this.getDays();
    this.$emit("month-change");
  }

  getMonthName() {
    this.monthName = this.calendar.getMonthName();
  }

  getDayTooltip(day: IDay): string {
    return `employés: ${
      day.works.length
        ? day.works.map((item) => this.getEmployee(item.employee).name)
        : "aucun"
    }`;
  }

  getEmployee(id: number | null) {
    return (
      this.employeesService.employees.find((elem) => elem.id == id) || {
        preference: "",
        name: "",
      }
    );
  }

  async mounted() {
    this.getDays();
    this.getMonthName();
  }

  getWorksPreference(works: IWorkDate[], preference: string): IWorkDate[] {
    return works.filter((work: IWorkDate) => {
      const startHour = work.start.getHours();
      const dayHours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
      const nightHours = [17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4];
      return preference == "morning"
        ? dayHours.includes(startHour)
        : nightHours.includes(startHour);
    });
  }
}
</script>

<style lang="scss">
$calendar-head-color: #363636;
$calendar-header-color: #3f3f3f;
$calendar-color: #e9e9e9;

.c-work-calendar {
  margin-left: auto;
  margin-right: auto;
  font-family: "Lato", sans-serif;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  // border-left: 1px $calendar-color solid;
  background-color: $calendar-head-color;
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  &__header {
    padding: 0.5em;
    text-align: center;
    color: white;
  }
  &__year,
  &__month {
    display: flex;
    justify-content: space-between;
    text-align: center;
  }
  &__month {
    font-size: 3em;
    font-family: "Berkshire Swash", cursive;
  }
  &__year {
    font-size: 1.3em;
    font-weight: 300;
    justify-content: center;
  }
}
.c-nodes {
  display: flex;
  flex-wrap: wrap;
  background-color: white;

  &--title {
    background-color: $calendar-header-color;
    color: #7e7e7e;
    font-size: 1.3em;
  }

  &__node {
    padding: 2em;
    font-size: 0.7em;
    flex: 1 0 14%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.1s;

    &:not(.c-nodes__node--day-name) {
      border-left: solid 1px #c7c7c7;
      // border-bottom: solid 1px #e0e0e0;
    }
  }
}

.c-day {
  &:not(.c-day--disabled) {
    // border-bottom: 1px $calendar-color solid;
    // border-right: 1px $calendar-color solid;
    &:hover {
      color: white;
      background-color: #ffc82c;
      cursor: pointer;
      * {
        transition: all 0.3s;
        color: white;
      }
    }
  }
  &--disabled,
  &--out-of-month {
    background-color: #f1f1f1;
  }
  &--active {
    color: white;
    background-color: #ffdd57;
    cursor: pointer;
    * {
      transition: all 0.3s;
      color: white;
    }
  }

  &__data-wrapper {
    width: 100%;
    height: 100%;
    text-align: center;
  }
  &__data {
    margin-top: 0.5em;
    display: flex;
    justify-content: center;
    color: #7e919a;
  }
  &__employee-preference {
    font-size: 1.3em;
    margin-right: 0.3em;
  }
  &__employee-number {
    font-size: 1.3em;
    font-weight: bold;

    &:not(:last-child) {
      margin-right: 1em;
    }
  }
  &__number {
    position: relative;
    top: -0.5em;
    &--disabled {
      color: #9b9b9b;
    }
  }
}
.icon.is-small {
  align-self: center;
}
.is-pointer {
  cursor: pointer;
  &:hover * {
    transition: all 0.3s;
    color: rgb(230, 230, 230);
  }
}
</style>
