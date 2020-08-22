<template>
  <div id="work-calendar" class="c-work-calendar">
    <div class="c-work-calendar__header">
      <div class="c-work-calendar__month">
        <div @click="setMonth(-1)" id="month-chevron-left">
          <b-icon pack="fas" icon="chevron-left" size="is-small" />
        </div>
        <span id="calendar-month-name">
          {{ monthName() }}
        </span>
        <div @click="setMonth(1)" id="month-chevron-right">
          <b-icon pack="fas" icon="chevron-right" size="is-small" />
        </div>
      </div>
      <div class="c-work-calendar__year">
        <div @click="setYear(-1)">
          <b-icon pack="fas" icon="chevron-left" size="is-small" />
        </div>
        <span id="calendar-year">
          {{ year() }}
        </span>
        <div @click="setYear(1)">
          <b-icon pack="fas" icon="chevron-right" size="is-small" />
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
          class="c-nodes__node c-nodes__node--day"
          v-for="(day, index) in dayNumbers"
          :key="`day-${index}`"
          :class="{
            'c-nodes__node--disabled': !isInMonth(day),
            'c-nodes__node--active': isActiveDay(day),
          }"
        >
          <div class="c-nodes__node--wrap-data" v-if="isInMonth(day)">
            <div class="c-nodes__node--day-number">{{ day }}</div>
            <div
              class="c-nodes__node--icon-data"
              :class="{ 'is-invisible': !getMorningWorkers(day).length }"
            >
              <b-icon pack="fas" icon="sun" size="is-small"> </b-icon
              >{{ getMorningWorkers(day).length }}
            </div>
            <div
              class="c-nodes__node--icon-data"
              :class="{ 'is-invisible': !getEvenningWorkers(day).length }"
            >
              <b-icon pack="fas" icon="moon" size="is-small" class=""> </b-icon
              >{{ getEvenningWorkers(day).length }}
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
    }
  },
  mounted() {
    this.getDays()
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
    getDays() {
      this.dayNumbers = []
      const maxDaysInWeek = 7
      let morning = []
      let evenning = []

      const startDate = new Date(this.year(), this.month(), 1)
      const endDate = new Date(this.year(), this.month() + 1, 0)
      let startDay = -(this.getWeekDay(startDate) - 1)
      let endDay = endDate.getDate() + maxDaysInWeek - this.getWeekDay(endDate)

      for (let dayNumber = startDay; dayNumber <= endDay; dayNumber++) {
        if (dayNumber !== 0) {
          this.dayNumbers.push(dayNumber)
        }
      }

      this.getAPIDays()
    },
    isActiveDay(dayNumber) {
      return (
        dayNumber === this.now.getDate() &&
        this.year() === this.now.getFullYear() &&
        this.month() === this.now.getMonth()
      )
    },
    isInMonth(dayNumber) {
      return dayNumber > 0 && dayNumber <= this.monthLength
    },
    setMonth(number) {
      this.dateSelector.setMonth(this.month() + number)
      this.getDays()
    },
    setYear(number) {
      this.dateSelector.setFullYear(this.year() + number)
      this.getDays()
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
    getEvenningWorkers(dayNumber) {
      let dayData = this.daysData[dayNumber]
      if (dayData) {
        return dayData['evenning']
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
  width: 600px;
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
  &__content {
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
    width: 2em;
    font-size: 0.7em;
    flex: 1 0 14%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.1s;
    padding: 1em;

    &--day:not(&--disabled):not(--active) {
      border-bottom: 1px $calendar-color solid;
      border-right: 1px $calendar-color solid;

      &:hover {
        color: white;
        background-color: #041fa9;
        cursor: pointer;
        div {
          transition: all 0.3s;
          color: white;
        }
      }
    }

    &--wrap-data {
      width: 100%;
      height: 100%;
      text-align: center;
    }

    &--day-number {
      position: relative;
      top: -0.5em;
      color: #673ab7;
      font-weight: bold;
    }

    &--icon-data {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin: 0.2em;
      color: #607d8b;
    }

    &--disabled {
      background-color: $calendar-color;
    }

    &--active {
      color: white;
      background-color: #5a74ff;
      cursor: pointer;
      div {
        transition: all 0.3s;
        color: white;
      }
    }
  }
}
.icon.is-small {
  align-self: center;
}
</style>
