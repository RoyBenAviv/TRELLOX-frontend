import { createStore } from 'vuex'
import boardModules from './modules/board-module.js'
import userModules from './modules/user-module.js'

// create a store instance
const store = createStore({
  strict: true,
  state: {
    isLoading: false,
  },
  getters: {
    isLoading(state) {
      return state.isLoading
    },
  },
  mutations: {
    setIsLoading(state, { isLoading }) {
      state.isLoading = isLoading
    },
  },
  actions: {},
  modules: {
    boardModules,
    userModules
  },
})

export default store