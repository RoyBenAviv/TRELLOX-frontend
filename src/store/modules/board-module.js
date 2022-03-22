import { boardService } from '../../services/board.service-local'

export default {
  state: {
    boards: null,
    filterBy: null,
  },
  getters: {
    getBoards(state) {
      return state.boards
    },
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    removeBoard(state, { id }) {
      const idx = state.boards.findIndex((board) => board._id === id)
      state.boards.splice(idx, 1)
    },
    saveBoard(state, { board }) {
      const idx = state.boards.findIndex((currBoard) => currBoard._id === board._id);
      if (idx !== -1) state.boards.splice(idx, 1, board);
      else state.boards.push(board);
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
  },
}
