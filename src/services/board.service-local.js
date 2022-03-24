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
  archiveGroup,
  addCard,
  getCardById,
  updateCard,
  archiveCard,
}

// For DEBUG:
window.boardService = boardService
// window.boardService.getCardById(boardId, cardId)

// board
async function query(filterBy) {
  try {
    // var queryStr = !filterBy ? '' : `?name=${filterBy.name}&sort=anaAref`
    var boards = await storageService.query(entity_key)
    if (filterBy) {
      // filtering
    }
    return boards
  } catch (err) {
    throw err
  }
}

async function getBoardById(boardId) {
  try {
    return await storageService.get(entity_key, boardId)
  } catch (err) {
    throw err
  }
}

async function updateBoard(board) {
  try {
    return await storageService.put(entity_key, board)
  } catch (err) {
    throw err
  }
}

function getEmptyBoard() {
  return {
    title: '',
    createdAt: Date.now(),
    isStarred: false,
    createdBy: {}, //add logged in user
    style: {},
    labels: _getLabelsForPM(),
    members: [], //add logged in user
    groups: [],
    activities: [],
    cmpsOrder: [],
  }
}

async function removeBoard(boardId) {
  try {
    return await storageService.delete(entity_key, boardId)
  } catch (err) {
    throw err
  }
}

// group
async function addGroup(boardId, title) {
  try {
    var board = await getBoardById(boardId)
    board.groups.push(_getEmptyGroup(title))
    return await updateBoard(board)
  } catch (err) {
    throw err
  }
}

async function editGroup(boardId, newGroup) {
  try {
    var board = getBoardById(boardId)
    const idx = board.groups.findIndex((group) => group.id === newGroup.id)
    board.groups[idx] = newGroup
    return await updateBoard(board)
  } catch (err) {
    throw err
  }
}

async function archiveGroup(boardId, groupId) {
  try {
    var board = await getBoardById(boardId)
    const idx = board.groups.findIndex((group) => group.id === groupId)
    const groupToArchive = board.groups.splice(idx, 1)[0]
    _archiveItem(groupToArchive)
    return await updateBoard(board)
  } catch (err) {
    throw err
  }
}

// card
async function addCard(boardId, groupId, title) {
  try {
    var board = await getBoardById(boardId)
    const idx = board.groups.findIndex((group) => group.id === groupId)
    board.groups[idx].cards.push(_getEmptyCard(title))
    return await updateBoard(board)
  } catch (err) {
    throw err
  }
}

async function getCardById(boardId, cardId) {
  try {
    var board = await getBoardById(boardId)
    var cardDetails = null
    board.groups.forEach((group) => {
      group.cards.forEach((card) => {
        if (card.id === cardId) cardDetails = { groupId: group.id, card }
      })
    })
    return cardDetails
  } catch (err) {
    throw err
  }
}

async function updateCard2(boardId, groupId, cardId, changes) {
  try {
    //finding current card
    var board = await getBoardById(boardId)
    const idxGroup = board.groups.findIndex((group) => group.id === groupId)
    const idxCard = board.groups[idxGroup].cards.findIndex((card) => card.id === cardId)
    var currCard = board.groups[idxGroup].cards[idxCard]

    const KEY = changes.key
    console.log('changes',changes);
    if(changes.action === 'singleVal'){ // singleVal -- if you want to remove val send '' or null
      currCard[KEY] = changes.value
    }

    // Array -- update and add new val to the array
    // changes.value should be the new item
    if (changes.action === 'update') { 
      if (changes.value.id) {
        const idx = currCard[KEY].findIndex((item) => item.id === changes.value.id)
        currCard[KEY].splice(idx, 1, changes.value)
      }else {
        changes.value.id = utilService.makeId()
        currCard[KEY].push(changes.value)
      }
    } 
    // Array -- remove from array
    // changes.value should be itemId
    else if (changes.action === 'remove') { 
      const idx = currCard[KEY].findIndex((item) => item.id === changes.value)
      currCard[KEY].splice(idx, 1)
    } 
    // to labels only!!
    // changes.value should be --
    // {
    //   color: #dede;
    //   title: 'string'
    // }
    else if (changes.action === 'createLabel') {
      changes.value.id = utilService.makeId()
      board.labels.push(changes.value)
      currCard[KEY].push(changes.value.id)
    } 
    return await updateBoard(board)
  } catch (err) {
    throw err
  }
}

// TODO: CREATE A FUNCTION THAT UPDATES BOARD's LABELS AND MEMBERS -- [key]
// else if (changes.action === 'editLabel') { // updates label in the board
//   const idx = board.labels.findIndex((l) => l.id === changes.value.id)
//   board.labels.splice(idx, 1, changes.value)
// } else if (changes.action === 'delete') { // delete label in the board
//   const idx = board.labels.findIndex((l) => l.id === changes.value)
//   board.labels.splice(idx, 1)
//   // delete from all cards
//   board.groups = board.groups.map((group) => {
//     group.cards = group.cards.map((card) => {
//       card.labelIds = card.labelIds.filter((labelId) => labelId !== changes.value)
//       return card
//     })
//     return group
//   })
// }

async function updateCard(board, groupId, updatedCard) {
  try {
    const idxGroup = board.groups.findIndex((group) => group.id === groupId)
    const idxCard = board.groups[idxGroup].cards.findIndex((card) => card.id === updatedCard.id)
    board.groups[idxGroup].cards.splice(idxCard, 1, updatedCard)
    await updateBoard(board)
    return updatedCard
  } catch (err) {
    console.log('Can not update card')
    throw err
  }
}

async function archiveCard(boardId, groupId, cardId) {
  try {
    var board = await getBoardById(boardId)
    const groupIdx = board.groups.findIndex((group) => group.id === groupId)
    const cardIdx = board.groups[groupIdx].cards.findIndex((card) => card.id === cardId)
    const cardToArchive = board.groups[groupIdx].cards.splice(cardIdx, 1)[0]
    _archiveItem(cardToArchive)
    return await updateBoard(board)
  } catch (err) {
    throw err
  }
}

//inside func // add try n catch
async function _createData() {
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
    title: 'Best board ever',
    createdAt: 1589983468418,
    isStarred: false,
    createdBy: {
      _id: 'u101',
      fullname: 'Shani',
      imgUrl: 'img.png',
    },
    style: {
      bgImgUrl: 'https://images.unsplash.com/photo-1554147090-e1221a04a025?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2048&q=80',
    },
    labels: _getLabelsForPM(),
    members: [
      {
        _id: 'u102',
        fullname: 'Tamir',
        imgUrl: 'img.png',
      },
    ],
    groups: [_getGroup('Processing'), _getGroup('Done'), _getGroup('Tasks for today'), _getGroup('Others')],
    activities: [],
    cmpsOrder: [],
  }
  boards = []
  boards.push(b1)
  storageService.postMany(entity_key, boards)
}

//project management
function _getLabelsForPM() {
  return [
    {
      id: 'l101',
      title: 'Copy Request',
      color: '#61bd4f',
    },
    {
      id: 'l102',
      title: 'One more step',
      color: '#f2d600',
    },
    {
      id: 'l103',
      title: 'Priority',
      color: '#ff9f1a',
    },
    {
      id: 'l104',
      title: 'Design Team',
      color: '#eb5a46',
    },
    {
      id: 'l105',
      title: 'Product Marketing',
      color: '#c377e0',
    },
    {
      id: 'l106',
      title: 'Trello Tip',
      color: '#0079bf',
    },
    {
      id: 'l107',
      title: 'Help',
      color: '#00c2e0',
    },
  ]
}

//company overview
function _getLabelsForCO() {
  return [
    {
      id: 'l101',
      title: 'Product',
      color: '#61bd4f',
    },
    {
      id: 'l102',
      title: 'Marketing',
      color: '#f2d600',
    },
    {
      id: 'l103',
      title: 'Sales',
      color: '#ff9f1a',
    },
    {
      id: 'l104',
      title: 'Support',
      color: '#eb5a46',
    },
    {
      id: 'l105',
      title: 'People',
      color: '#c377e0',
    },
    {
      id: 'l106',
      title: 'IT',
      color: '#0079bf',
    },
  ]
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
    cards: [
      {
        id: utilService.makeId(),
        title: 'card 1', //1
        status: 'in-progress', //1
        description: 'description sdfg sdfg sdfgh sdfgh sdfg', //1
        dueDate: 16156215211, //1
        createdAt: 1590999730348,
        checklists: [
          {
            id: 'YEhmF',
            title: 'Checklist',
            todos: [
              {
                id: '212jX',
                title: 'To Do 1',
                isDone: false,
              },
              {
                id: 'sdfghj',
                title: 'To Do 2',
                isDone: true,
              },
            ],
          },
        ],
        comments: [],
        memberIds: ['u123', 'u345'],
        labelIds: [],
        byMember: {
          _id: 'u101',
          username: 'Tal',
          fullname: 'Tal Tarablus',
          imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
        },
        style: {},
      },
      {
        id: utilService.makeId(),
        title: 'card 2',
        status: 'in-progress',
        description: 'description sdfg sdfg sdfgh sdfgh sdfg',
        dueDate: 16156215211,
        createdAt: 1590999730348,
        checklists: [
          {
            id: 'YEhmF',
            title: 'Checklist',
            todos: [
              {
                id: '212jX',
                title: 'To Do 1',
                isDone: false,
              },
              {
                id: 'sdfghj',
                title: 'To Do 2',
                isDone: true,
              },
            ],
          },
        ],
        comments: [],
        members: [
          {
            _id: 'u101',
            username: 'Tal',
            fullname: 'Tal Tarablus',
            imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
          },
        ],
        labelIds: [],
        byMember: {
          _id: 'u101',
          username: 'Tal',
          fullname: 'Tal Tarablus',
          imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
        },
        style: {},
      },
      {
        id: utilService.makeId(),
        title: 'card 3',
        status: 'in-progress',
        description: 'description sdfg sdfg sdfgh sdfgh sdfg',
        dueDate: 16156215211,
        createdAt: 1590999730348,
        checklists: [
          {
            id: 'YEhmF',
            title: 'Checklist',
            todos: [
              {
                id: '212jX',
                title: 'To Do 1',
                isDone: false,
              },
              {
                id: 'sdfghj',
                title: 'To Do 2',
                isDone: true,
              },
            ],
          },
        ],
        comments: [],
        members: [
          {
            _id: 'u101',
            username: 'Tal',
            fullname: 'Tal Tarablus',
            imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
          },
        ],
        labelIds: ['l101', 'l102'],
        byMember: {
          _id: 'u101',
          username: 'Tal',
          fullname: 'Tal Tarablus',
          imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
        },
        style: {
          bgColor: '#26de81',
        },
      },
    ],
  }
}

function _getEmptyCard(title = '') {
  return {
    id: utilService.makeId(),
    title,
    status: '',
    description: '',
    dueDate: null,
    createdAt: Date.now(),
    checklists: [],
    comments: [],
    members: [], // add creator
    labelIds: [],
    byMember: {}, // add creator
    style: {},
  }
}

async function _archiveItem(item) {
  const archive = (await storageService.query(archive_key)) || []
  storageService.post(archive_key, item)
}

// function _createLabel({ title, color }) {
//   return {
//     id: utilService.makeId(),
//     title,
//     color,
//   }
// }

// This IIFE functions for Dev purposes
// It allows testing of real time updates (such as sockets) by listening to storage events
// ;(async () => {
//   var boards = await storageService.query('board')

//   // Dev Helper: Groupens to when localStorage changes in OTHER browser
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
