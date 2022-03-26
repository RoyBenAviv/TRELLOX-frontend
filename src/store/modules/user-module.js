// import { userService } from '../../services/user.service'
// import { authService } from '../../services/auth.service'
// 
export default {
  state: {
    users: [],
    loggedInUser: {
      _id: 'u105',
      fullname: 'Assaf Margalit',
      username: 'AssafMargalit',
      imgUrl: null,
    },
    filterBy: {},
  },
  getters: {
    users(state) {
      return state.users
    },
    loggedInUser(state) {
      return state.loggedInUser
    },
  },
  mutations: {
    setUsers(state, { users }) {
      state.users = users
    },
    setLoggedInUser(state, { loggedInUser }) {
      state.loggedInUser = loggedInUser
    },
    removeUser(state, { userId }) {
      const idx = state.users.findIndex((user) => user._id === userId)
      state.users.splice(idx, 1)
    },
    saveUser(state, { savedUser }) {
      const idx = state.users.findIndex((currUser) => currUser._id === savedUser._id)
      if (idx !== -1) state.users.splice(idx, 1, savedUser)
      else state.users.unshift(savedUser)
    },
    setFilter(state, { filterBy }) {
      state.filterBy = filterBy
    },
  },
  actions: {
    async loadUsers({ commit, state }) {
      commit({ type: 'setIsLoading', isLoading: true })
      try {
        const users = await userService.query(state.filterBy)
        commit({ type: 'setUsers', users })
      } catch (err) {
        console.log('err', err)
      } finally {
        commit({ type: 'setIsLoading', isLoading: false })
      }
    },
    async loadLoggedInUser({ commit, state }) {
      commit({ type: 'setIsLoading', isLoading: true })
      try {
        const loggedInUser = await authService.getLoggedinUser()
        commit({ type: 'setLoggedInUser', loggedInUser })
      } catch (err) {
        console.log('err', err)
      } finally {
        commit({ type: 'setIsLoading', isLoading: false })
      }
    },
    async removeUser({ commit }, { userId }) {
      try {
        await userService.remove(userId)
        commit({ type: 'removeUser', userId })
      } catch (err) {
        console.log('err', err)
      }
    },
    async getUserById(_, { userId }) {
      try {
        const user = await userService.getById(userId)
        return JSON.parse(JSON.stringify(user))
      } catch (err) {
        console.log('err', err)
      }
    },
    async saveUser({ commit }, { user }) {
      const newUser = JSON.parse(JSON.stringify(user))
      try {
        const savedUser = user._id ? await userService.update(newUser) : await authService.signup(user)
        commit({ type: 'saveUser', savedUser })
        commit({ type: 'setLoggedInUser', loggedInUser: savedUser })
      } catch (err) {
        console.log('err', err)
      }
    },
    async login({ commit }, { userInfo }) {
      try {
        const loggedInUser = await authService.login(userInfo)
        commit({ type: 'setLoggedInUser', loggedInUser })
      } catch (err) {
        console.log('err', err)
      }
    },
    async logout({ commit }) {
      try {
        await authService.logout()
        commit({ type: 'setLoggedInUser', loggedInUser: '' })
      } catch (err) {
        console.log('err', err)
      }
    },
    async filter({ commit, dispatch }, { filterBy }) {
      commit({ type: 'setFilter', filterBy })
      dispatch({ type: 'loadUsers' })
    },
  },
}