import { boardService } from '../../services/board.service-local'

export default {
  state: {
    boards: null,
    filterBy: null,
    currBoard: null,
    labelTitleShown: false,
    colorPalletLength: 11
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
        if(board._id === state.currBoard._id) state.currBoard = board
        state.boards.splice(idx, 1, board)
      } else state.boards.push(board)
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
      console.log('board',board);
      try {
        console.log('board is re-loading');
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
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot add group', err)
        throw err
      }
    },
    async addCard({ commit, state }, { groupId, title }) {
      try {
        const board = await boardService.addCard(state.currBoard._id, groupId, title)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot add card', err)
        throw err
      }
    },
    async archiveGroup({ commit, state }, { groupId }) {
      try {
        const board = await boardService.archiveGroup(state.currBoard._id, groupId)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot archive group', err)
        throw err
      }
    },
    async archiveCard({ commit, state }, { groupId, cardId }) {
      try {
        const board = await boardService.archiveCard(state.currBoard._id, groupId, cardId)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot archive group', err)
        throw err
      }
    },
    async updateCard({ commit, state }, { groupId, card}) {
      try {
        const board = await boardService.updateCard(state.currBoard._id, groupId, card)
        commit({ type: 'saveBoard', board })
      } catch (err) {
        console.log('Cannot update card', err)
        throw err
      }
    },
    async getCardById({commit}, {boardId, cardId}) {
      try {
        const cardDetails = await boardService.getCardById(boardId, cardId)
        return cardDetails
      } catch (err) {
        console.log('Cannot find card', err)
        throw err
      }
    },
  },
}
