import { localService } from '../../services/board.service-local'
import { boardService } from '../../services/board.service'
import { socketService, SOCKET_EVENT_BOARD_CHANGED } from '../../services/socket.service'
import { utilService } from '../../services/util.service'

export default {
  state: {
    boards: [],
    currBoard: null,
    labelTitleShown: false,
    labelColors: ['color0', 'color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10'],
    imagePicker: [
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzMTI4NzN8MHwxfHNlYXJjaHw0fHxtb3VudGFpbnxlbnwwfHx8fDE2NDgyMjMxMjg&ixlib=rb-1.2.1&q=85',
      'https://images.unsplash.com/photo-1480497490787-505ec076689f?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzMTI4NzN8MHwxfHNlYXJjaHwzfHxtb3VudGFpbnxlbnwwfHx8fDE2NDgyMjMxMjg&ixlib=rb-1.2.1&q=85',
      'https://images.unsplash.com/photo-1433477155337-9aea4e790195?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb',
    ],
    boardColors: [
      { body: '#0079bf', header: '#0066a0' },
      { body: '#d29034', header: '#b0792c' },
      { body: '#519839', header: '#448030' },
      { body: '#b04632', header: '#943b2a' },
      { body: '#89609e', header: '#735185' },
      { body: '#cd5a91', header: '#ac4c7a' },
      { body: '#4bbf6b', header: '#3fa05a' },
      { body: '#00aecc', header: '#0092ab' },
    ],
    coverColors: ['#7BC86C', '#F5DD29', '#FFAF3F', '#EF7564', '#CD8DE5', '#5BA4CF', '#29CCE5', '#6DECA9', '#FF8ED4', '#172B4D'],
    coverImages: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1463584954611-9d8ebd80dfd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1483835724473-d69ca66efb25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    ],
    isMemberDrag: false,
    isStickerDrag: false,
    onlineUsersOnBoard: [],
  },
  getters: {
    boards(state) {
      return JSON.parse(JSON.stringify(state.boards))
    },
    currBoard(state) {
      return JSON.parse(JSON.stringify(state.currBoard))
    },
    labelTitleShown(state) {
      return state.labelTitleShown
    },
    imagePicker(state) {
      return state.imagePicker
    },
    boardColors(state) {
      return state.boardColors
    },
    labelColors(state) {
      return JSON.parse(JSON.stringify(state.labelColors))
    },
    coverColors(state) {
      return JSON.parse(JSON.stringify(state.coverColors))
    },
    coverImages(state) {
      return JSON.parse(JSON.stringify(state.coverImages))
    },
    isMemberDrag(state) {
      return state.isMemberDrag
    },
    isStickerDrag(state) {
      return state.isStickerDrag
    },
    onlineUsersOnBoard(state) {
      return state.onlineUsersOnBoard
    },
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    setCurrBoard(state, { board }) {
      state.currBoard = board
    },
    toggleLabelTitle(state) {
      state.labelTitleShown = !state.labelTitleShown
    },
    removeBoard(state, { id }) {
      const idx = state.boards.findIndex((board) => board._id === id)
      state.boards.splice(idx, 1)
    },
    saveBoard(state, { board }) {
      const idx = state.boards.findIndex((b) => b._id === board._id)
      if (idx !== -1) {
        if (state.currBoard && board._id === state.currBoard._id) state.currBoard = board
        state.boards.splice(idx, 1, board)
      } else {
        state.boards.push(board)
        state.currBoard = board
      }
    },
    addGroup(state, { emptyGroup }) {
      state.currBoard.groups.push(emptyGroup)
    },
    addActivity(state, { activity, clearAct }) {
      if (clearAct) state.currBoard.activities.pop()
      state.currBoard.activities.unshift(activity)
    },
    memberDrag(state, { isDrag }) {
      state.isMemberDrag = isDrag
    },
    stickerDrag(state, { isDrag }) {
      state.isStickerDrag = isDrag
    },
    setOnlineUsersOnBoard(state, { users }) {
      state.onlineUsersOnBoard = users
    },
  },
  actions: {
    async loadBoards({ commit }) {
      commit({ type: 'setIsLoading', isLoading: true })
      try {
        var boards = await boardService.query({})
        commit({ type: 'setBoards', boards })
        socketService.off(SOCKET_EVENT_BOARD_CHANGED)
        socketService.on(SOCKET_EVENT_BOARD_CHANGED, (board) => {
          commit({ type: 'saveBoard', board })
        })
      } catch (err) {
        console.error('Cannot Load boards', err)
        throw err
      } finally {
        commit({ type: 'setIsLoading', isLoading: false })
      }
    },
    async setCurrBoard({ commit }, { boardId }) {
      commit({ type: 'setIsLoading', isLoading: true })
      try {
        const board = await boardService.getBoardById(boardId)
        commit({ type: 'setCurrBoard', board })
        return board
      } catch (err) {
        console.log('Cannot find board', err)
        throw err
      } finally {
        commit({ type: 'setIsLoading', isLoading: false })
      }
    },
    async removeBoard({ commit }, { id }) {
      try {
        var id = await boardService.removeBoard(id)
        commit({ type: 'removeBoard', id })
      } catch (err) {
        console.error('Cannot remove board', err)
        throw err
      }
    },
    async saveBoard({ commit }, { board }) {
      try {
        var board = await boardService.updateBoard(board)
        commit({ type: 'saveBoard', board })
        return board
      } catch (err) {
        console.error('Cannot Edit/Add board', err)
        throw err
      }
    },
    async filterBoard({ commit }, { boardId, filterBy }) {
      try {
        const board = await boardService.getBoardById(boardId, filterBy)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot find card', err)
        throw err
      }
    },
    async addGroup({ commit, state }, { title }) {
      try {
        const board = await localService.addGroup(state.currBoard._id, title)
        console.log('store addGroup board', board)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot add group', err)
        throw err
      }
    },
    async addCard({ commit, state }, { groupId, title }) {
      try {
        const board = await localService.addCard(state.currBoard._id, groupId, title)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot add card', err)
        throw err
      }
    },
    async removeGroup({ commit, state }, { groupId }) {
      try {
        const board = await localService.removeGroup(state.currBoard._id, groupId)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot remove group', err)
        throw err
      }
    },
    async removeCard({ commit, state }, { groupId, cardId }) {
      try {
        const board = await localService.removeCard(state.currBoard._id, groupId, cardId)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot remove group', err)
        throw err
      }
    },
    async updateCard({ commit, state }, { groupId, card }) {
      try {
        const board = await localService.updateCard(state.currBoard._id, groupId, card)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot update card', err)
        throw err
      }
    },
    async getCardById({ commit }, { boardId, cardId }) {
      try {
        const cardDetails = await localService.getCardById(boardId, cardId)
        return cardDetails
      } catch (err) {
        console.log('Cannot find card', err)
        throw err
      }
    },
    async addActivity({ commit, getters, dispatch }, { txt, card }) {
      const clearAct = getters.currBoard.activities.length > 100
      const activity = {
        id: utilService.makeId(),
        txt: txt,
        createdAt: Date.now(),
        byMember: {
          _id: getters.loggedinUser?._id || '',
          fullname: getters.loggedinUser?.fullname || 'Guest',
          imgUrl: getters.loggedinUser?.imgUrl || '',
        },
        card: {
          id: card.id,
          title: card.title,
        },
      }
      commit({ type: 'addActivity', activity, clearAct })
      await dispatch({ type: 'saveBoard', board: getters.currBoard })
    },
  },
}
