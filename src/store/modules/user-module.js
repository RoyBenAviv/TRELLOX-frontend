import { userService } from '../../services/user.service'

export default {
  state: {
    loggedinUser: userService.getLoggedinUser(),
  },
  getters: {
    loggedinUser({ loggedinUser }) {
      return loggedinUser
    },
  },
  mutations: {
    setLoggedinUser(state, { user }) {
      state.loggedinUser = user ? { ...user } : null
    },
  },
  actions: {
    async login({ commit }, { userCred }) {
      try {
        const user = await userService.login(userCred)
        commit({ type: 'setLoggedinUser', user })
        return user
      } catch (err) {
        console.log('cannot set user', err)
        throw err
      }
    },
    async logout({ commit }) {
      try {
        await userService.logout()
        commit({ type: 'setLoggedinUser', user: null })
      } catch (err) {
        console.log('logout failed', err)
      }
    },
    async signup({ commit }, { userCred }) {
      try {
        const user = await userService.signup(userCred)
        commit({ type: 'setLoggedinUser', user })
      } catch (err) {
        console.log('signup failed', err)
        throw err
      }
    },
  },
}
