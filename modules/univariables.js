module.exports = {
  bot: null,
  // nickUsername: '',
  disconnected: false,
  onWynncraft: false,
  onAWorld: false,
  currentWorld: 'WC0',
  resourcePackLoading: false,
  compassCheck: false,
  botUsername: null,
  realUsername: null,
  cancelCompassTimer: null,
  cancelLoginTimer: null,
  hubTimer: null,
  apiInterval: null,
  sleep: ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
}
