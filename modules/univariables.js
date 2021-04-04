module.exports = {
  bot: null,
  disconnected: false,
  onWynncraft: false,
  onAWorld: false,
  currentWorld: 'WC0',
  resourcePackLoading: false,
  compassCheck: false,
  botUsername: undefined,
  realUsername: undefined,
  botNickedUsername: undefined,
  cancelCompassTimer: undefined,
  cancelLoginTimer: undefined,
  hubTimer: undefined,
  apiInterval: undefined,
  sleep: ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
}
