export const utilService = {
  delay,
  getRandomInt,
  makeId,
  makeAvatar,
}

function makeAvatar(fullname) {
  fullname = fullname.split(' ')
  var short = (fullname.split(' ')[0].split('')[0] + fullname.split(' ')[1].split('')[0]).toUpperCases()
  return short.toUpperCases()
}

function delay(ms = 1500) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

function makeId(length = 5) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _filter(board) {
  const filterBy = board.filterBy
  // if (filterBy.txt) {

  // }
  logger.info('start to filter', filterBy)
  if (filterBy.by.noOne) {
    board.groups = board.groups.map((group) => {
      group.cards = group.cards.filter((card) => card.memberIds.length === 0)
      return group
    })
  } else {
    if (filterBy.by.options.length) {
      board.groups = board.groups.map((group) => {
        group.cards = group.cards.map((card) => {
          card.memberIds = card.memberIds.filter((memberId) => filterBy.by.options.includes(memberId))
          return card
        })
        return group
      })
    }
  }
  return board
}

// filterBy: {
//   txt: '',
//   by: {
//     noOne: false,
//     options: [],
//   },
//   due: {
//     none: false,
//     over: false,
//     tommarow: false,
//   },
//   label: {
//     none: false,
//     options: [],
//   },
// },
