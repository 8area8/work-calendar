<template>
  <div class="container">
    <b-message
      :class="{
        'is-invisible':
          Math.abs(calendar.getMonth() - calendar.now.getMonth()) <= 1 &&
          calendar.getYear() === calendar.now.getFullYear(),
      }"
      title="Attention"
      type="is-warning"
      class="c-message--warning"
      :closable="false"
      size="is-small"
    >
      Il est impossible de remplir des dates trop éloignées.
    </b-message>
    <div id="work-calendar" class="c-work-calendar">
      <div class="c-work-calendar__header">
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
      <div class="c-work-calendar__content">
        <div class="c-nodes c-nodes--title">
          <div
            v-for="(name, index) of calendar.getWeekDayNames()"
            :key="`dayName-${index}`"
            class="c-nodes__node"
          >
            {{ name }}
          </div>
        </div>
        <div class="c-nodes">
          <div
            v-for="(day, index) in calendar.days"
            :id="calendar.getStringDate(day)"
            :key="`day-${index}`"
            class="c-nodes__node c-day"
            :class="{
              'c-day--out-of-month': !calendar.isInMonth(day),
              'c-day--active': calendar.isActiveDay(day),
              'c-day--disabled': calendar.isOverDatabaseLimit(day),
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
              <div
                v-for="(param, dayParamIndex) in dayParams"
                :key="'day-data-' + dayParamIndex"
                class="c-day__data"
                :class="{ 'is-invisible': !param.getWorkers(day).length }"
              >
                <b-icon pack="fas" :icon="param.icon" size="is-small" />{{
                  param.getWorkers(day).length
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Calendar } from '../models/calendar'

export default {
  data() {
    return {
      calendar: new Calendar(),
      daysData: {},
      dayParams: [],
    }
  },
  mounted() {
    this.getDays()
    this.dayParams = [
      {
        getWorkers: this.getMorningWorkers,
        icon: 'sun',
      },
      {
        getWorkers: this.getEveningWorkers,
        icon: 'moon',
      },
    ]
  },
  methods: {
    getDays() {
      this.calendar.getDays()
      this.getAPIDays()
    },
    getAPIDays() {
      this.daysData = {}
    },
    getMorningWorkers(dayNumber) {
      const dayData = this.daysData[dayNumber]
      if (dayData) {
        return dayData.morning
      }
      return []
    },
    getEveningWorkers(dayNumber) {
      const dayData = this.daysData[dayNumber]
      if (dayData) {
        return dayData.evening
      }
      return []
    },
  },
}
</script>

<style lang="scss">
$calendar-head-color: #363636;
$calendar-header-color: #3f3f3f;
$calendar-color: #e9e9e9;

.c-work-calendar {
  margin-left: auto;
  margin-right: auto;
  font-family: 'Lato', sans-serif;
  border-left: 1px $calendar-color solid;

  &__header {
    padding: 0.5em;
    text-align: center;
    background-color: $calendar-head-color;
    color: white;
  }
  &__year,
  &__month {
    display: flex;
    justify-content: space-between;
    text-align: center;
  }
  &__month {
    font-size: 1.2em;
  }
  &__year {
    font-size: 0.8em;
    font-weight: 300;
  }
}
.c-nodes {
  display: flex;
  flex-wrap: wrap;

  &--title {
    background-color: $calendar-header-color;
    color: #7e7e7e;
  }

  &__node {
    padding: 1em;
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
    border-bottom: 1px $calendar-color solid;
    border-right: 1px $calendar-color solid;
    &:hover {
      color: white;
      background-color: #ff0057;
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
    background-color: #607d8b;
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
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 0.2em;
    color: #607d8b;
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
