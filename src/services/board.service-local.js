import { storageService } from './async-storage.service'
import { utilService } from './util.service'
import { boardService } from './board.service'

const archive_key = 'archive'

export const localService = {
  getEmptyBoard,
  addGroup,
  editGroup,
  archiveGroup,
  addCard,
  getCardById,
  updateCard,
  archiveCard,
}

function getEmptyBoard() {
  return {
    title: '',
    createdAt: Date.now(),
    isStarred: false,
    createdBy: {}, //add logged in user
    style: {
      bgImUrl: '',
      bgColor: '',
    },
    labels: _getLabelsForPM(),
    members: [], //add logged in user
    groups: [_getEmptyGroup('Todo'), _getEmptyGroup('Doing'), _getEmptyGroup('Done')],
    activities: [],
    cmpsOrder: [],
  }
}

// group
async function addGroup(boardId, title) {
  try {
    var board = await boardService.getBoardById(boardId)
    board.groups.push(_getEmptyGroup(title))
    return await boardService.updateBoard(board)
  } catch (err) {
    throw err
  }
}

async function editGroup(boardId, newGroup) {
  try {
    var board = boardService.getBoardById(boardId)
    const idx = board.groups.findIndex((group) => group.id === newGroup.id)
    board.groups[idx] = newGroup
    return await boardService.updateBoard(board)
  } catch (err) {
    throw err
  }
}

async function archiveGroup(boardId, groupId) {
  try {
    var board = await boardService.getBoardById(boardId)
    const idx = board.groups.findIndex((group) => group.id === groupId)
    const groupToArchive = board.groups.splice(idx, 1)[0]
    _archiveItem(groupToArchive)
    return await boardService.updateBoard(board)
  } catch (err) {
    throw err
  }
}

// card
async function addCard(boardId, groupId, title) {
  try {
    var board = await boardService.getBoardById(boardId)
    const idx = board.groups.findIndex((group) => group.id === groupId)
    board.groups[idx].cards.push(_getEmptyCard(title))
    return await boardService.updateBoard(board)
  } catch (err) {
    throw err
  }
}

async function getCardById(boardId, cardId) {
  try {
    var board = await boardService.getBoardById(boardId)
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

async function updateCard(boardId, groupId, updatedCard) {
  try {
    const board = await boardService.getBoardById(boardId)
    const idxGroup = board.groups.findIndex((group) => group.id === groupId)
    const idxCard = board.groups[idxGroup].cards.findIndex((card) => card.id === updatedCard.id)
    board.groups[idxGroup].cards.splice(idxCard, 1, updatedCard)
    return await boardService.updateBoard(board)
  } catch (err) {
    console.log('Can not update card')
    throw err
  }
}

async function archiveCard(boardId, groupId, cardId) {
  try {
    var board = await boardService.getBoardById(boardId)
    const groupIdx = board.groups.findIndex((group) => group.id === groupId)
    const cardIdx = board.groups[groupIdx].cards.findIndex((card) => card.id === cardId)
    const cardToArchive = board.groups[groupIdx].cards.splice(cardIdx, 1)[0]
    _archiveItem(cardToArchive)
    return await boardService.updateBoard(board)
  } catch (err) {
    throw err
  }
}

//project management
function _getLabelsForPM() {
  return [
    {
      id: 'l101',
      title: 'Copy Request',
      className: 'color0',
    },
    {
      id: 'l102',
      title: 'One more step',
      className: 'color1',
    },
    {
      id: 'l103',
      title: 'Priority',
      className: 'color2',
    },
    {
      id: 'l104',
      title: 'Design Team',
      className: 'color3',
    },
    {
      id: 'l105',
      title: 'Product Marketing',
      className: 'color4',
    },
    {
      id: 'l106',
      title: 'Trello Tip',
      className: 'color5',
    },
    {
      id: 'l107',
      title: 'Help',
      className: 'color6',
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

function _getEmptyCard(title = '') {
  return {
    id: utilService.makeId(),
    title,
    status: '',
    description: '',
    dueDate: null,
    createdAt: Date.now(),
    attachments: [],
    checklists: [],
    comments: [],
    memberIds: [], // add creator
    labelIds: [],
    byMember: {}, // add creator
    style: {
      type: '',
      cover: '',
      fullCover: false,
    },
  }
}

async function _archiveItem(item) {
  const archive = (await storageService.query(archive_key)) || []
  storageService.post(archive_key, item)
}