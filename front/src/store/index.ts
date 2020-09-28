import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    employeeID: -1,
  },
  mutations: {
    changeFilter(state, value) {
      state.employeeID = value;
    },
  },
  actions: {},
  modules: {},
});
