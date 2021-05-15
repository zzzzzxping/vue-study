import Vue from 'vue'
import Vuex from './g-vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  mutations: {
    add (state) {
      state.counter++
    }
  },
  actions: {
    add ({ state, commit }) {
      setTimeout(_ => {
        commit('add')
      })
    }
  },
  modules: {
  }
})
