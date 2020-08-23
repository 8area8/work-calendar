import { calendar } from '../models/calendar'

export const state = () => ({
  days: [],
})

export const mutations = {
  /**
   * Select a new month.
   *
   * @param {Any} _state - the Vuex state.
   * @param {number} difference the desired difference from the current month.
   *
   * @returns {void}
   */
  setMonth(_state: any, difference: number): void {
    calendar.selector.setMonth(calendar.getMonth() + difference)
    calendar.getDays()
  },

  /**
   * Select a new year.
   *
   * @param {Any} _state - the Vuex state.
   * @param {number} difference the desired difference from the current year.
   *
   * @returns {void}
   */
  setYear(_state: any, difference: number): void {
    calendar.selector.setFullYear(calendar.getYear() + difference)
    calendar.getDays()
  },
}
