import { storageService } from './async-storage.service'
import { userService } from './user.service-local'
import { utilService } from './util.service'
// import { socketService, SOCKET_EVENT_REVIEW_ADDED } from './socket.service'

const entity_key = 'board'
_createData()

export const boardService = {
  query,
  getBoardById,
  updateBorad: updateBoard,
  getEmptyBoard,
  removeBoard,
  // _createData
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

async function updateBoard(board, action, newValue) {

}

function getEmptyBoard() {
  return  {
      title: '',
      createdAt: Date.now(),
      createdBy: userService.getLoggedinUser(),
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
      members: [],
      lists: [_getList('my list'),]
    }
}

async function removeBoard(boardId) {
  return await storageService.delete(entity_key, boardId)
}

async function _createData() {
  console.log('hi');
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
    lists: [_getList('Processing'), _getList('Done'), _getList('Tasks for today'), _getList('Others')]
  }
  boards = []
  boards.push(b1)
  storageService.postMany(entity_key, boards)
}

function _getList(title){
  return {
    id: utilService.makeId(),
    title,
    cards: [_getCard('card1'), _getCard('card2'), _getCard('card3')]
  }
}

function _getCard(title){
  return {
    id: utilService.makeId(),
    title,
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
