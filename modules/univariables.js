
let disconnected = false
let onWynncraft = false
let onAWorld = false
let currentWorld = 'WC0'
let resourcePackLoading = false
let compassCheck = false
let botUsername = null
let realUsername = null
// let nickUsername
let bot = null

const universal = {}
universal.disconnected = {
  get: () => { return disconnected },
  set: (variable) => { disconnected = variable }
}
universal.onWynncraft = {
  get: () => { return onWynncraft },
  set: (variable) => { onWynncraft = variable }
}
universal.onAWorld = {
  get: () => { return onAWorld },
  set: (variable) => { onAWorld = variable }
}
universal.currentWorld = {
  get: () => { return currentWorld },
  set: (variable) => { currentWorld = variable }
}
universal.resourcePackLoading = {
  get: () => { return resourcePackLoading },
  set: (variable) => { resourcePackLoading = variable }
}
universal.compassCheck = {
  get: () => { return compassCheck },
  set: (variable) => { compassCheck = variable }
}
universal.realUsername = {
  get: () => { return realUsername },
  set: (variable) => { realUsername = variable }
}
universal.botUsername = {
  get: () => { return botUsername },
  set: (variable) => { botUsername = variable }
}
universal.bot = {
  get: () => { return bot },
  set: (variable) => { bot = variable }
}
module.exports = universal
