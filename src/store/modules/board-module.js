import { boardService } from '../../services/board.service-local'

export default {
  state: {
    boards: [],
    filterBy: {stock: 'All'},
  },
  getters: {
    boards(state) {
      return state.boards
    },
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    removeBoard(state, { boardId }) {
      const idx = state.boards.findIndex((board) => board._id === boardId)
      state.boards.splice(idx, 1)
    },
    saveBoard(state, { savedBoard }) {
      const idx = state.boards.findIndex((currBoard) => currBoard._id === savedBoard._id)
      console.log('savedBoard',savedBoard);
      state.boards.map((t) => console.log(t._id))
      console.log('idx',idx);
      if (idx !== -1) state.boards.splice(idx, 1, savedBoard)
      else state.boards.unshift(savedBoard)
    },
    setFilter(state, { filterBy }) {
      state.filterBy = filterBy
    },
  },
  actions: {
    async loadBoards({ commit, state }) {
      commit({ type: 'setIsLoading', isLoading: true })
      try {
        const boards = await boardService.query(state.filterBy)
        commit({ type: 'setBoards', boards })
      } catch(err) {
        console.log('err', err)
      } finally {
        commit({ type: 'setIsLoading', isLoading: false })
      }
    },
    async removeBoard({ commit }, { boardId }) {
      try{
        await boardService.remove(boardId)
        commit({ type: 'removeBoard', boardId })
      } catch(err){
        console.log('err', err)
      }
    },
    async getBoardById(_, { boardId }) {
      try {
        const board = await boardService.getById(boardId)
        return JSON.parse(JSON.stringify(board))
      } catch(err) {
        console.log('err', err)
      }
    },
    async saveBoard({ commit }, { board }) {
      const newBoard = JSON.parse(JSON.stringify(board))
      try{
        const savedBoard = await boardService.save(newBoard)
        commit({ type: 'saveBoard', savedBoard })
      } catch(err){
        console.log('err', err)
      }
    },
    async filter({ commit, dispatch }, { filterBy }) {
      commit({ type: 'setFilter', filterBy })
      dispatch({ type: 'loadBoards' })
    },
  },
}
