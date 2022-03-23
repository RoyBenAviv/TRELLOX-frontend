import { storageService } from './async-storage.service'
import { userService } from './user.service-local'
import { utilService } from './util.service'
// import { socketService, SOCKET_EVENT_REVIEW_ADDED } from './socket.service'

const entity_key = 'board'
const archive_key = 'archive'
_createData()

export const boardService = {
  query,
  getBoardById,
  updateBoard,
  getEmptyBoard,
  removeBoard,
  addList,
  editList,
  updateCard,
  addCard,
  archiveList,
  archiveCard
}

// For DEBUG:
window.boardService = boardService

async function query(filterBy) {
  // var queryStr = !filterBy ? '' : `?name=${filterBy.name}&sort=anaAref`
  var boards = await storageService.query(entity_key)
  if (filterBy) {
    // filtering
  }
  return boards
}

async function getBoardById(boardId) {
  return await storageService.get(entity_key, boardId)
}

async function updateBoard(board) {
  return await storageService.put(entity_key, board)
}

function getEmptyBoard() {
  return {
    title: '',
    createdAt: Date.now(),
    createdBy: {
      _id: 'u101',
      fullname: 'Shani',
      imgUrl: 'img.png',
    },
    style: {
      bgcImgUrl: 'https://images.unsplash.com/photo-1557251407-6356f6384370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE5MzB8MHwxfHNlYXJjaHwyNXx8YW1zdGVyZGFtfGVufDB8fHx8MTY0MjQxNDE0Ng&ixlib=rb-1.2.1&q=80&w=200'
    },
    labels: [
      {
        id: 'l101',
        title: 'Done',
        color: '#61bd4f',
      },
      {
        id: 'l102',
        title: 'Progress',
        color: '#61bd33',
      },
    ],
    members: [],
    lists: [_getList('my list')],
  }
}

async function removeBoard(boardId) {
  return await storageService.delete(entity_key, boardId)
}

async function addList(boardId, title) {
  var board = await getBoardById(boardId)
  board.lists.push(_getEmptyList(title))
  return await updateBoard(board)
}

async function archiveList(boardId, listId) {
  var board = await getBoardById(boardId)
  const idx = board.lists.findIndex(list => list.id === listId)
  const listToArchive = board.lists.splice(idx, 1)[0]
  _archiveItem(listToArchive)
  return await updateBoard(board)
}
async function archiveCard(boardId, listId, cardId) {
  var board = await getBoardById(boardId)
  const listIdx = board.lists.findIndex((list) => list.id === listId)
  const cardIdx = board.lists[listIdx].cards.findIndex(card => card.id === cardId)
  const cardToArchive = board.lists[listIdx].cards.splice(cardIdx, 1)[0]
  _archiveItem(cardToArchive)
  return await updateBoard(board)
}

async function _archiveItem(item) {
  const archive = await storageService.query(archive_key) || []
  storageService.post(archive_key, item)
}

async function editList(boardId, newList) {
  var board = getBoardById(boardId)
  const idx = board.lists.findIndex((list) => list.id === newList.id)
  board.lists[idx] = newList
  return await updateBoard(board)
}

async function addCard(boardId, listId, title) {
  var board = await getBoardById(boardId)
  const idx = board.lists.findIndex((list) => list.id === listId)
  board.lists[idx].cards.push(_getEmptyCard(title))
  return await updateBoard(board)
}

async function updateCard(boardId, listId, updatedCard) {
  var board = await getBoardById(boardId)
  const idxList = board.lists.findIndex((list) => list.id === listId)
  const idxCard = board.lists[idxList].findIndex((card) => card.id === updatedCard.id)
  board.lists[idxList][idxCard] = updatedCard
  return await updateBoard(board)
}

async function _createData() {
  console.log('hi')
  var boards = await query()
  if (boards.length) return
  // board example {
  // //_id comes from store
  //   title: 'board1',
  //   createdAt: 1589983468418,
  //   createdBy: {
  //     _id: 'u101',
  //     fullname: 'Shani',
  //     imgUrl: 'img.png',
  //   },
  //   style: {},
  //   labels: [
  //     {
  //       id: 'l101',
  //       title: 'Done',
  //       color: '#61bd4f',
  //     },
  //     {
  //       id: 'l102',
  //       title: 'Progress',
  //       color: '#61bd33',
  //     },
  //   ],
  //   members: [
  //     {
  //       _id: 'u102',
  //       fullname: 'Tamir',
  //       imgUrl: 'img.png',
  //     },
  //   ],
  //   lists: [
  //     {
  //       id: 'g101',
  //       title: 'List 1',
  //       cards: [
  //         {
  //           id: 'c101',
  //           title: 'upload to git',
  //         },
  //         {
  //           id: 'c102',
  //           title: 'eat food',
  //         },
  //       ],
  //     },
  //     {
  //       id: 'g102',
  //       title: 'List 2',
  //       cards: [
  //         {
  //           id: 'c102',
  //           title: 'finish sprint 4',
  //         },
  //         {
  //           id: 'c104',
  //           title: 'watch tv',
  //         },
  //       ],
  //     },
  //   ],
  // }
  const b1 = {
    title: 'board1',
    createdAt: 1589983468418,
    createdBy: {
      _id: 'u101',
      fullname: 'Shani',
      imgUrl: 'img.png',
    },
    style: {
      bgcImgUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE5MzB8MHwxfHNlYXJjaHwzfHxjb2Rpbmd8ZW58MHx8fHwxNjQyMzU4NjIz&ixlib=rb-1.2.1&q=80&w=200'
    },
    labels: [
      {
        id: 'l101',
        title: 'Done',
        color: '#61bd4f',
      },
      {
        id: 'l102',
        title: 'Progress',
        color: '#61bd33',
      },
    ],
    members: [
      {
        _id: 'u102',
        fullname: 'Tamir',
        imgUrl: 'img.png',
      },
    ],
    lists: [_getList('Processing'), _getList('Done'), _getList('Tasks for today'), _getList('Others')],
  }
  boards = []
  boards.push(b1)
  storageService.postMany(entity_key, boards)
}

function _getEmptyList(title = '') {
  return {
    id: utilService.makeId(),
    title,
    cards: [],
  }
}

function _getList(title) {
  return {
    id: utilService.makeId(),
    title,
    cards: [_getEmptyCard('card1'), _getEmptyCard('card2'), _getEmptyCard('card3')],
  }
}

function _getEmptyCard(title = '') {
  return {
    id: utilService.makeId(),
    title,
  }
}

// // This IIFE functions for Dev purposes
// // It allows testing of real time updates (such as sockets) by listening to storage events
// ;(async () => {
//   var boards = await storageService.query('board')

//   // Dev Helper: Listens to when localStorage changes in OTHER browser
//   window.addEventListener('storage', async () => {
//     console.log('Storage updated')
//     const freshBoards = await storageService.query('board')
//     if (freshBoards.length === boards.length + 1) {
//       console.log('Board Added - localStorage updated from another browser')
//       socketService.emit(SOCKET_EVENT_REVIEW_ADDED, freshBoards[freshBoards.length - 1])
//     }
//     boards = freshBoards
//   })
// })()
