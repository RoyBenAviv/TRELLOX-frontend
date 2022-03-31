import { userService } from '../../services/user.service'

export default {
  state: {
    loggedinUser: userService.getLoggedinUser(),
    users: [],
  },
  getters: {
    users({ users }) {
      return users
    },
    loggedinUser({ loggedinUser }) {
      return loggedinUser
    },
  },
  mutations: {
    setLoggedinUser(state, { user }) {
      state.loggedinUser = user ? { ...user } : null
    },
    setUsers(state, { users }) {
      state.users = users
    },
  },
  actions: {
    async loadUsers({ commit }) {
      try {
        const users = await userService.getUsers()
        commit({ type: 'setUsers', users })
      } catch (err) {
        console.log('Error load users', err)
        throw err
      }
    },
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
