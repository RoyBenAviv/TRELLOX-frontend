import { storageService } from './async-storage.service'
import { userService } from './user.service-local'
// import { socketService, SOCKET_EVENT_REVIEW_ADDED } from './socket.service'

const entityType = 'board'
_createData()

export const boardService = {
  query,
  getBoardById,
  updateBorad,
  getEmptyBoard,
  removeBoard,
}

async function query(filterBy) {
  // var queryStr = !filterBy ? '' : `?name=${filterBy.name}&sort=anaAref`
  const boards = await storageService.query(entityType)
  if(filterBy){
    // filtering
  }
  return boards
}

async function getBoardById(boardId) {
  return await storageService.get(entityType, boardId)
}

async function updateBorad(boardId) {}

async function getEmptyBoard(boardId) {}

async function removeBoard(boardId) {
  return storageService.delete('board', boardId)
}

function _createData() {
  const boards = query()
  board = {
    _id: 'b101',
    title: 'board1',
    createdAt: 1589983468418,
    createdBy: {
      _id: 'u101',
      fullname: 'Shani',
      imgUrl: 'img.png',
    },
    style: {},
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
    lists: [
      {
        id: 'g101',
        title: 'List 1',
        cards: [
          {
            id: 'c101',
            title: 'upload to git',
          },
          {
            id: 'c102',
            title: 'eat food',
          },
        ],
      },
      {
        id: 'g102',
        title: 'List 2',
        cards: [
          {
            id: 'c102',
            title: 'finish sprint 4',
          },
          {
            id: 'c104',
            title: 'watch tv',
          },
        ],
      },
    ],
  }
}

// async function add(board) {
//   board.aboutUser = await userService.getById(board.aboutUserId)
//   const addedBoard = storageService.post('board', board)

//   return addedBoard
// }

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
