export const utilService = {
  delay,
  getRandomInt,
  makeId,
  makeAvatar,
  getFormattedTime,
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

function getFormattedTime(activityTime) {
  const now = Date.now()
  const diff = now - activityTime
  var msg = ''
  var helper
  if (diff <= 5000) {
    // less than 5 seconds
    msg = 'just now'
  } else if (diff <= 20000) {
    //20,000
    // less than 20 seconds
    msg = 'a few seconds ago'
  } else if (diff <= 120000) {
    //60,000
    // less than 2 minute
    msg = 'a minute ago'
  } else if (diff <= 3600000) {
    //3,600,000
    //less then hour
    helper = Math.floor(diff / 60 / 1000)
    msg = helper + ' minutes ago'
  } else if (diff <= 7200000) {
    //7,200,000
    //less then 2 hour
    msg = 'a hour ago'
  } else if (diff <= 86400000) {
    //86,400,000
    //less then day
    helper = Math.floor(diff / 60 / 60 / 1000)
    msg = helper + ' hours ago'
  } else {
    //Mar 25 at 7:31 PM
    activityTime = new Date(activityTime)
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const minutes = activityTime.getMinutes()
    const hour = activityTime.getHours()
    msg += month[activityTime.getMonth()] + ' '
    msg += activityTime.getDate() + ' at '
    msg += hour < 10 ? '0' + hour : hour
    msg += ':'
    msg += minutes < 10 ? '0' + minutes : minutes
  }
  return msg
}
