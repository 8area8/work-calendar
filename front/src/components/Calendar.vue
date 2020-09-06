<template>
  <div class="container">
    <!-- MESSAGE -->
    <b-message
      :class="{ 'is-invisible': calendar.isInvisible() }"
      title="Attention"
      type="is-warning"
      :closable="false"
      size="is-small"
    >
      {{ overLimitMessage }}
    </b-message>

    <!-- CALENDAR -->
    <div id="work-calendar" class="c-work-calendar">
      <!-- HEADER -->
      <div class="c-work-calendar__header">
        <!-- MONTH -->
        <div class="c-work-calendar__month">
          <div
            id="month-chevron-left"
            class="is-flex is-pointer"
            @click="calendar.setMonth(-1)"
          >
            <b-icon
              pack="fas"
              icon="chevron-left"
              size="is-small"
              class="has-text-grey"
            />
          </div>
          <span id="calendar-month-name">
            {{ calendar.getMonthName() }}
          </span>
          <div
            id="month-chevron-right"
            class="is-flex is-pointer"
            @click="calendar.setMonth(1)"
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
          <div class="is-flex is-pointer" @click="calendar.setYear(-1)">
            <b-icon
              pack="fas"
              icon="chevron-left"
              size="is-small"
              class="has-text-grey"
            />
          </div>
          <span id="calendar-year">
            {{ calendar.getYear() }}
          </span>
          <div class="is-flex is-pointer" @click="calendar.setYear(1)">
            <b-icon
              pack="fas"
              icon="chevron-right"
              size="is-small"
              class="has-text-grey"
            />
          </div>
        </div>
      </div>
      <!-- CONTENT -->
      <div class="c-work-calendar__content">
        <!-- DAYS NAMES -->
        <div class="c-nodes c-nodes--title">
          <div
            v-for="(name, index) of calendar.getWeekDayNames()"
            :key="`dayName-${index}`"
            class="c-nodes__node"
          >
            {{ name }}
          </div>
        </div>
        <!-- DAYS NODES -->
        <div class="c-nodes">
          <div
            v-for="(day, index) in days"
            :id="calendar.getStringDate(day)"
            :key="`day-${index}`"
            class="c-nodes__node c-day"
            :class="{
              'c-day--out-of-month': !calendar.isInMonth(day),
              'c-day--active': calendar.isActiveDay(day),
              'c-day--disabled': calendar.isOverDatabaseLimit(day)
            }"
          >
            <div
              class="c-day__data-wrapper"
              :class="{ 'is-invisible': calendar.isOverDatabaseLimit(day) }"
            >
              <div
                class="c-day__number"
                :class="{ 'c-day__number--disabled': !calendar.isInMonth(day) }"
              >
                {{ day.number }}
              </div>
              <div class="c-day__data" :class="{ 'is-invisible': ![] }">
                <b-icon pack="fas" icon="sun" size="is-small" />
                <span>
                  {{ 3 }}
                </span>
                <b-icon pack="fas" icon="moon" size="is-small" />
                <span>
                  {{ 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { calendar } from "../clean_architecture/exposers/calendar";

@Component
export default class Calendar extends Vue {
  calendar = calendar;
  overLimitMessage = "Il est impossible de remplir des dates trop éloignées.";

  get days() {
    return this.calendar.getDays();
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
    div {
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
    color: #636165;
    font-size: 1.3em;
    margin-top: 0.5em;
  }
  &__number {
    position: relative;
    top: -0.5em;
    color: #607d8b;
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
}
</style>