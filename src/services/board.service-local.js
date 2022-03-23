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
    createdBy: {
      _id: 'u101',
      fullname: 'Shani',
      imgUrl: 'img.png',
    },
    style: {
      bgcImgUrl: 'https://images.unsplash.com/photo-1557251407-6356f6384370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE5MzB8MHwxfHNlYXJjaHwyNXx8YW1zdGVyZGFtfGVufDB8fHx8MTY0MjQxNDE0Ng&ixlib=rb-1.2.1&q=80&w=200',
    },
    labels: _getLabelsForPM(),
    members: [],
    groups: [_getGroup('my group')],
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
    var foundCard = null
    board.groups.forEach(group =>{
      group.cards.forEach(card => {
        if (card.id === cardId) foundCard = card
      })
    })
    return foundCard
  } catch (err) {
    throw err
  }
}

// label
// add (boardId, groupId, cardId, changes: { label: { action: connect, value: labelId }})
// remove (boardId, groupId, cardId, changes: { label: { action: remove, value: labelId }})
// create (boardId, groupId, cardId, changes: { label: { action: create, value: { title, color }}})
// update (boardId, groupId, cardId, changes: { label: { action: remove, value: updatedLabel }})
// delete (boardId, groupId, cardId, changes: { label: { action: delete, value: labelId }})
async function updateCard(boardId, groupId, cardId, changes) {
  try {
    //finding current card
    var board = await getBoardById(boardId)
    const idxGroup = board.groups.findIndex((group) => group.id === groupId)
    const idxCard = board.groups[idxGroup].cards.findIndex((card) => card.id === cardId)
    var currCard = board.groups[idxGroup].cards[idxCard]

    if (changes.label) {
      if (changes.label.action === 'toggle') {
        const idx = currCard.labelIds.findIndex((labelId) => labelId === changes.label.value)
        if (idx === -1) currCard.labelIds.push(changes.label.value)
        else currCard.labelIds.splice(idx, 1)
      } else if (changes.label.action === 'add') {
        currCard.labelIds.push(changes.label.value)
      } else if (changes.label.action === 'remove') {
        const idx = currCard.labelIds.findIndex((labelId) => labelId === changes.label.value)
        currCard.labelIds.splice(idx, 1)
      } else if (changes.label.action === 'create') {
        // create
        var newLabel = changes.label.value
        newLabel.id = utilService.makeId()
        board.labels.push(newLabel)
        // add
        currCard.labelIds.push(newLabel.id)
      } else if (changes.label.action === 'edit') {
        const idx = board.labels.findIndex((l) => l.id === changes.label.value.id)
        board.labels.splice(idx, 1, changes.label.value)
      } else if (changes.label.action === 'delete') {
        const idx = board.labels.findIndex((l) => l.id === changes.label.value)
        board.labels.splice(idx, 1)
        // delete from all cards
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.map((card) => {
            card.labelIds = card.labelIds.filter((labelId) => labelId !== changes.label.value)
            return card
          })
          return group
        })
      }
    }
    return await updateBoard(board)
  } catch (err) {
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
      bgcImgUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE5MzB8MHwxfHNlYXJjaHwzfHxjb2Rpbmd8ZW58MHx8fHwxNjQyMzU4NjIz&ixlib=rb-1.2.1&q=80&w=200',
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
  }
  boards = []
  boards.push(b1)
  storageService.postMany(entity_key, boards)
}

//project management
function _getLabelsForPM(){
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
function _getLabelsForCO(){
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
    }
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
        title: 'card 1',
        labelIds: ['l101', 'l104', 'l105', 'l106'],
      },
      {
        id: utilService.makeId(),
        title: 'card 2',
        labelIds: ['l102'],
      },
      {
        id: utilService.makeId(),
        title: 'card 3',
        labelIds: ['l103'],
      },
    ],
  }
}

function _getEmptyCard(title = '') {
  return {
    id: utilService.makeId(),
    title,
    labelIds: [],
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
