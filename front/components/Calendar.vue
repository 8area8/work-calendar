<template>
  <div id="work-calendar" class="c-work-calendar">
    <div class="c-work-calendar__header">
      <div class="c-work-calendar__month">
        <div @click="setMonth(-1)">
          <b-icon pack="fas" icon="chevron-left" size="is-small" />
        </div>
        {{ monthName() }}
        <div @click="setMonth(1)">
          <b-icon pack="fas" icon="chevron-right" size="is-small" />
        </div>
      </div>
      <div class="c-work-calendar__year">
        <div @click="setYear(-1)">
          <b-icon pack="fas" icon="chevron-left" size="is-small" />
        </div>
        {{ year() }}
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
          :class="{
            'c-nodes__node--disabled': day == null,
            'c-nodes__node--active':
              day &&
              day.number == now.getDate() &&
              year() === now.getFullYear() &&
              dateSelector.getMonth() === now.getMonth(),
          }"
          v-for="(day, index) in days"
          :key="`days-${index}`"
        >
          <div class="c-nodes__node--wrap-data" v-if="day">
            <div class="c-nodes__node--day-number">{{ day.number }}</div>
            <div
              class="c-nodes__node--icon-data"
              :class="{ 'is-invisible': !day.day.length }"
            >
              <b-icon pack="fas" icon="sun" size="is-small"> </b-icon
              >{{ day.day.length }}
            </div>
            <div
              class="c-nodes__node--icon-data"
              :class="{ 'is-invisible': !day.night.length }"
            >
              <b-icon pack="fas" icon="moon" size="is-small" class=""> </b-icon
              >{{ day.night.length }}
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
      days: [],
    }
  },
  mounted() {
    this.getDays()
  },
  computed: {
    dayNames() {
      let name = ''
      let dayNames = []
      while (this.dateSelector.getDay() !== 1) {
        this.dateSelector.setDate(this.dateSelector.getDate() + 1)
      }
      for (let i = 0; i < 7; i++) {
        name = this.dateSelector.toLocaleDateString('default', {
          weekday: 'short',
        })
        dayNames.push(name.slice(0, -1).toUpperCase())
        this.dateSelector.setDate(this.dateSelector.getDate() + 1)
      }
      return dayNames
    },
    monthLength() {
      let date = new Date(this.year(), this.dateSelector.getMonth() + 1, 0)
      return date.getDate()
    },
  },
  methods: {
    year() {
      return this.dateSelector.getFullYear()
    },
    monthName() {
      let name = this.dateSelector.toLocaleDateString('default', {
        month: 'long',
      })
      return name[0].toUpperCase() + name.slice(1)
    },
    getWeekDay(date) {
      let number = date.getDay()
      return (number === 0 ? 7 : number) - 1
    },
    getDays() {
      this.days = []
      let day = []
      let night = []
      let date = new Date(this.year(), this.dateSelector.getMonth(), 1)
      while (this.days.length < this.getWeekDay(date)) {
        this.days.push(null)
      }
      for (let number = 1; number <= this.monthLength; number++) {
        if (number == 10) {
          this.days.push({ number, day: [1, 2], night })
        } else {
          this.days.push({ number, day, night })
        }
      }
      date.setDate(this.monthLength)
      for (let num of [...Array(7 - date.getDay())]) {
        this.days.push(null)
      }
      return this.days
    },
    setMonth(number) {
      this.dateSelector.setMonth(this.dateSelector.getMonth() + number)
      this.getDays()
    },
    setYear(number) {
      this.dateSelector.setFullYear(this.dateSelector.getFullYear() + number)
      this.getDays()
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
