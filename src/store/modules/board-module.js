import { boardService } from '../../services/board.service-local'

export default {
  state: {
    boards: null,
    filterBy: null,
    currBoard: null,
  },
  getters: {
    getBoards(state) {
      return JSON.parse(JSON.stringify(state.boards))
    },
    getCurrBoard(state) {
      return JSON.parse(JSON.stringify(state.currBoard))
    },
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    setCurrBoard(state, { board }) {
      state.currBoard = board
    },
    removeBoard(state, { id }) {
      const idx = state.boards.findIndex((board) => board._id === id)
      state.boards.splice(idx, 1)
    },
    saveBoard(state, { board }) {
      const idx = state.boards.findIndex((currBoard) => currBoard._id === board._id)
      if (idx !== -1) state.boards.splice(idx, 1, board)
      else state.boards.push(board)
    },
    addGroup(state, { emptyGroup }) {
      state.currBoard.groups.push(emptyGroup)
    },
    // setFilter(state, { filterBy }) {
    //   state.filterBy = filterBy;
    // },
  },
  actions: {
    async loadBoards({ commit, state }) {
      try {
        var boards = await boardService.query(state.filterBy)
        commit({ type: 'setBoards', boards })
      } catch (err) {
        console.error('Cannot Load boards', err)
        throw err
      }
    },
    async setCurrBoard({ commit }, { boardId }) {
      try {
        const board = await boardService.getBoardById(boardId)
        commit({ type: 'setCurrBoard', board })
        return board
      } catch (err) {
        console.log('Cannot find board', err)
        throw err
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
      } catch (err) {
        console.error('Cannot Edit/Add board', err)
        throw err
      }
    },
    async addGroup({ commit, state }, { title }) {
      try {
        const board = await boardService.addGroup(state.currBoard._id, title)
        commit({ type: 'setCurrBoard', board })
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot add group', err)
        throw err
      }
    },
    async addCard({ commit, state }, { groupId, title }) {
      try {
        const board = await boardService.addCard(state.currBoard._id, groupId, title)
        commit({ type: 'setCurrBoard', board })
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot add card', err)
        throw err
      }
    },
    async archiveGroup({ commit, state }, { groupId }) {
      try {
        const board = await boardService.archiveGroup(state.currBoard._id, groupId)
        commit({ type: 'setCurrBoard', board })
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot archive group', err)
        throw err
      }
    },
    async archiveCard({ commit, state }, { groupId, cardId }) {
      try {
        const board = await boardService.archiveCard(state.currBoard._id, groupId, cardId)
        commit({ type: 'setCurrBoard', board })
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot archive group', err)
        throw err
      }
    },
    async updateCard({ commit, state }, { groupId, cardId, changes }) {
      try {
        const board = await boardService.updateCard(state.currBoard._id, groupId, cardId, changes)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot archive group', err)
        throw err
      }
    },
  },
}
