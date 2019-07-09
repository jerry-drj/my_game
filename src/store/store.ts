import Vue from 'vue'
import Vuex from 'vuex'
import fetch from '../api/fetch'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    queryHeadLineData(state, option) {
      return fetch(option)
    }
  }
})
