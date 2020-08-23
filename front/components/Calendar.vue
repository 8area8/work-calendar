<template>
  <div class="container">
    <b-message
      :class="{
        'is-invisible':
          Math.abs(month() - now.getMonth()) <= 1 &&
          year() === now.getFullYear(),
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
            @click="setMonth(-1)"
            id="month-chevron-left"
            class="is-flex is-pointer"
          >
            <b-icon
              pack="fas"
              icon="chevron-left"
              size="is-small"
              class="has-text-grey"
            />
          </div>
          <span id="calendar-month-name">
            {{ monthName() }}
          </span>
          <div
            @click="setMonth(1)"
            id="month-chevron-right"
            class="is-flex is-pointer"
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
          <div @click="setYear(-1)" class="is-flex is-pointer">
            <b-icon
              pack="fas"
              icon="chevron-left"
              size="is-small"
              class="has-text-grey"
            />
          </div>
          <span id="calendar-year">
            {{ year() }}
          </span>
          <div @click="setYear(1)" class="is-flex is-pointer">
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
            class="c-nodes__node"
            v-for="(name, index) of dayNames"
            :key="`dayName-${index}`"
          >
            {{ name }}
          </div>
        </div>
        <div class="c-nodes">
          <div
            class="c-nodes__node c-day"
            v-for="(day, index) in dayNumbers"
            :key="`day-${index}`"
            :class="{
              'c-day--out-of-month': !isInMonth(day),
              'c-day--active': isActiveDay(day),
              'c-day--disabled': isOverDatabaseLimit(day),
            }"
            :id="getStringDate(day)"
          >
            <div
              class="c-day__data-wrapper"
              :class="{ 'is-invisible': isOverDatabaseLimit(day) }"
            >
              <div
                class="c-day__number"
                :class="{ 'c-day__number--disabled': !isInMonth(day) }"
              >
                {{ day.number }}
              </div>
              <div
                v-for="(param, index) in dayParams"
                :key="'day-data-' + index"
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

<script>
export default {
  data: function () {
    return {
      now: new Date(),
      dateSelector: new Date(),
      daysData: {},
      dayNumbers: [],
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
  computed: {
    dayNames() {
      let name = ''
      let dayNames = []
      let date = new Date()
      while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1)
      }
      for (let i = 0; i < 7; i++) {
        name = date.toLocaleDateString('default', {
          weekday: 'short',
        })
        dayNames.push(name.slice(0, -1).toUpperCase())
        date.setDate(date.getDate() + 1)
      }
      return dayNames
    },
    monthLength() {
      let date = new Date(this.year(), this.month() + 1, 0)
      return date.getDate()
    },
  },
  methods: {
    /* def */
    year() {
      return this.dateSelector.getFullYear()
    },
    month() {
      return this.dateSelector.getMonth()
    },
    monthName() {
      let name = this.dateSelector.toLocaleDateString('default', {
        month: 'long',
      })
      return name[0].toUpperCase() + name.slice(1)
    },
    getWeekDay(date) {
      let number = date.getDay()
      return number === 0 ? 7 : number
    },
    getStringDate(day) {
      return `day-${day.year}-${String(day.month).padStart(2, '0')}-${String(
        day.number
      ).padStart(2, '0')}`
    },
    isActiveDay(day) {
      return (
        day.number === this.now.getDate() &&
        day.year === this.now.getFullYear() &&
        day.month === this.now.getMonth()
      )
    },
    isInMonth(day) {
      return day.month === this.month()
    },
    isOverDatabaseLimit(day) {
      let monthDiff = day.month - this.now.getMonth()
      return Math.abs(monthDiff) >= 2 || day.year !== this.now.getFullYear()
    },
    setMonth(number) {
      this.dateSelector.setMonth(this.month() + number)
      this.getDays()
    },
    setYear(number) {
      this.dateSelector.setFullYear(this.year() + number)
      this.getDays()
    },
    getDays() {
      this.getDayNumbers()
      this.getAPIDays()
    },
    getDayNumbers() {
      this.dayNumbers = []
      const maxDaysInWeek = 7
      let morning = []
      let evening = []

      const startDate = new Date(this.year(), this.month(), 1)
      const endDate = new Date(this.year(), this.month() + 1, 0)

      const startWeekDate = new Date(
        this.year(),
        this.month(),
        1 - (this.getWeekDay(startDate) - 1)
      )
      const endWeekDate = new Date(
        this.year(),
        this.month(),
        endDate.getDate() + maxDaysInWeek - this.getWeekDay(endDate)
      )

      let date = new Date(startWeekDate.valueOf())
      console.log(date, endWeekDate)
      while (date <= endWeekDate) {
        this.dayNumbers.push({
          year: date.getFullYear(),
          month: date.getMonth(),
          number: date.getDate(),
        })
        date.setDate(date.getDate() + 1)
      }
    },
    getAPIDays() {
      this.daysData = {}
    },
    getMorningWorkers(dayNumber) {
      let dayData = this.daysData[dayNumber]
      if (dayData) {
        return dayData['morning']
      }
      return []
    },
    getEveningWorkers(dayNumber) {
      let dayData = this.daysData[dayNumber]
      if (dayData) {
        return dayData['evening']
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
