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
              {{ getYear() }}
            </span>
          </div>
        </div>
        <!-- TABLE CONTENT -->
        <div class="c-work-calendar__content table-container">
          <!-- DAYS NODES -->
          <table class="table is-fullwidth has-text-centered">
            <thead
              class="has-text-light"
              style="background-color: #3c3b3b !important;"
            >
              <tr>
                <th
                  v-for="weekDay in weekNames"
                  :key="'weekDay-' + weekDay"
                  style="padding: 2em"
                  class="has-text-grey has-text-weight-light has-text-centered"
                >
                  {{ weekDay }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, index) in weeks" :key="'week-' + index">
                <th
                  @click="openDayModale(day)"
                  v-for="day in week"
                  style="border-width: 0 1px 0;"
                  :key="'week-' + index + '-day-' + day.number"
                  class="c-day"
                  :class="{
                    'c-day--out-of-month': !calendar.isInMonth(day),
                    'c-day--active': calendar.isActiveDay(day),
                    'c-day--disabled': calendar.isOverDatabaseLimit(day),
                  }"
                >
                  <div
                    class="c-day__data-wrapper"
                    :class="{
                      'is-invisible': calendar.isOverDatabaseLimit(day),
                    }"
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
                        v-if="$store.state.employeeID === -1"
                        :eveningWorks="
                          workHandler.getWorksPreference(day.works, 'evening')
                        "
                        :morningWorks="
                          workHandler.getWorksPreference(day.works, 'morning')
                        "
                      />
                      <CalendarDataSingle
                        v-else
                        :work="
                          workHandler.getEmployeeWork(
                            day.works,
                            $store.state.employeeID
                          )
                        "
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Day
      ref="day"
      :isActive="isModalActive"
      :day="modalDay"
      @close-modal="isModalActive = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PropType } from "vue";
import CalendarDataAll from "./CalendarDataAll.vue";
import CalendarDataSingle from "./CalendarDataSingle.vue";
import Day from "./Day.vue";

import { IDay, IWorkDate } from "../clean_architecture/entities/calendar";
import { IEmployee } from "../clean_architecture/entities/worker";

import { calendarHandler } from "../clean_architecture/interactors/calendar";
import { employeeHandler } from "../clean_architecture/interactors/employee";
import { workHandler } from "../clean_architecture/interactors/work";

@Component({
  components: {
    Day,
    CalendarDataAll,
    CalendarDataSingle,
  },
})
export default class Calendar extends Vue {
  calendar = calendarHandler;
  workHandler = workHandler;

  days: IDay[] = [];
  modalDay: IDay = { works: [], id: null, number: 0, month: 0, year: 0 };

  monthName = "";
  isModalActive = false;

  get weeks(): IDay[][] {
    const weeks: IDay[][] = [];
    this.days.forEach((day: IDay, index: number) => {
      if (index % 7 == 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(day);
    });
    return weeks;
  }

  get weekNames() {
    return this.calendar.getWeekDayNames();
  }

  getYear() {
    return this.calendar.getYear();
  }

  openDayModale(day: IDay) {
    this.isModalActive = true;
    this.modalDay = day;
  }

  async getDays() {
    this.days = await this.calendar.getDays();
    this.$emit("month-change", this.days);
  }

  setMonth(difference: number) {
    this.calendar.setMonth(difference);
    this.getMonthName();
    this.getDays();
  }

  getMonthName() {
    this.monthName = this.calendar.getMonthName();
  }

  async mounted() {
    this.getDays();
    this.getMonthName();
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

.c-day {
  &:not(.c-day--disabled) {
    &:hover {
      color: white;
      background-color: #ffc82c;
      transition: all 0.3s;
      cursor: pointer;
      * {
        transition: all 0.3s;
      }
    }
  }
  &--disabled,
  &--out-of-month {
    background-color: #f1f1f1;
  }
  &--active {
    background-color: #ffdd57;
    cursor: pointer;
    * {
      transition: all 0.3s;
    }
  }

  &__data-wrapper {
    width: 100%;
    height: 100%;
    text-align: center;
  }
  &__data {
    margin: 2em 0 2em 0;
    color: #7e919a;
    font-size: 0.7em;
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
    margin: auto;
    font-weight: 400;
    width: 5em;
    color: #767070;
    background-color: #f2f2f2bd;
    border-radius: 5px 5px 2px 2px;
    box-shadow: rgba(21, 23, 35, 0.14) 0px 2px 2px 0px,
      rgba(0, 0, 0, 0.14) 0px 1px 1px 0px;

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
