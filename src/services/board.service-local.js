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
  addGroup,
  editGroup,
  updateCard,
  addCard,
  archiveGroup,
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
    groups: [_getGroup('my group')],
  }
}

async function removeBoard(boardId) {
  return await storageService.delete(entity_key, boardId)
}

async function addGroup(boardId, title) {
  var board = await getBoardById(boardId)
  board.groups.push(_getEmptyGroup(title))
  return await updateBoard(board)
}

async function archiveGroup(boardId, groupId) {
  var board = await getBoardById(boardId)
  const idx = board.groups.findIndex(group => group.id === groupId)
  const groupToArchive = board.groups.splice(idx, 1)[0]
  _archiveItem(groupToArchive)
  return await updateBoard(board)
}
async function archiveCard(boardId, groupId, cardId) {
  var board = await getBoardById(boardId)
  const groupIdx = board.groups.findIndex((group) => group.id === groupId)
  const cardIdx = board.groups[groupIdx].cards.findIndex(card => card.id === cardId)
  const cardToArchive = board.groups[groupIdx].cards.splice(cardIdx, 1)[0]
  _archiveItem(cardToArchive)
  return await updateBoard(board)
}

async function _archiveItem(item) {
  const archive = await storageService.query(archive_key) || []
  storageService.post(archive_key, item)
}

async function editGroup(boardId, newGroup) {
  var board = getBoardById(boardId)
  const idx = board.groups.findIndex((group) => group.id === newGroup.id)
  board.groups[idx] = newGroup
  return await updateBoard(board)
}

async function addCard(boardId, groupId, title) {
  var board = await getBoardById(boardId)
  const idx = board.groups.findIndex((group) => group.id === groupId)
  board.groups[idx].cards.push(_getEmptyCard(title))
  return await updateBoard(board)
}

async function updateCard(boardId, groupId, updatedCard) {
  var board = await getBoardById(boardId)
  const idxGroup = board.groups.findIndex((group) => group.id === groupId)
  const idxCard = board.groups[idxGroup].findIndex((card) => card.id === updatedCard.id)
  board.groups[idxGroup][idxCard] = updatedCard
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
  //   groups: [
  //     {
  //       id: 'g101',
  //       title: 'Group 1',
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
  //       title: 'Group 2',
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
    groups: [_getGroup('Processing'), _getGroup('Done'), _getGroup('Tasks for today'), _getGroup('Others')],
  }
  boards = []
  boards.push(b1)
  storageService.postMany(entity_key, boards)
}

function _getEmptyGroup(title = '') {
  return {
    id: utilService.makeId(),
    title,
    cards: [],
  }
}

function _getGroup(title) {
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
// // It allows testing of real time updates (such as sockets) by groupening to storage events
// ;(async () => {
//   var boards = await storageService.query('board')

//   // Dev Helper: Groupens to when localStorage changes in OTHER browser
//   window.addEventGroupener('storage', async () => {
//     console.log('Storage updated')
//     const freshBoards = await storageService.query('board')
//     if (freshBoards.length === boards.length + 1) {
//       console.log('Board Added - localStorage updated from another browser')
//       socketService.emit(SOCKET_EVENT_REVIEW_ADDED, freshBoards[freshBoards.length - 1])
//     }
//     boards = freshBoards
//   })
// })()
