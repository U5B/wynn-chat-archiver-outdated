const log = require('../logging')
const simplediscord = require('../simplediscord')
const config = require('../config/config.json')
const universal = require('../universal.js')
const wcaCore = require('./core')
const msg = require('./onMessage')
const events = {}
events.onceLogin = function () {
  log.warn('Connected to Wynncraft.')
  // COMMENT: onWynncraft is set to true on startup
  universal.state.disconnected = false
  universal.state.onWynncraft = true
  universal.info.droidIGN = universal.droid.username

  simplediscord.sendDate(config.statusChannel, `${config.firstConnectMessage}`)
}
events.onLogin = function () {
  log.log('Login event fired.')
  clearInterval(universal.timer.cancelCompassTimer)
  // COMMENT: onAWorld is used for whenever the WCA successfully logs into a world that isn't the hub
  universal.state.onWorld = false
  universal.state.serverSwitch = false
  // COMMENT: clear any compass checks
  // COMMENT: fallback to WC0 until the world is online
  universal.info.currentWorld = 'WC0'
  simplediscord.status()// COMMENT: check discord status
  log.warn('Connected.')
}
events.onceSpawn = function () {
  log.getChat()
}
events.onSpawn = async function () {
  log.log('Spawn event fired.')
  // COMMENT: Wait for the chunks to load before checking
  await universal.droid.waitForChunksToLoad()
  log.log('Chunks loaded...')
  wcaCore.compass()
}
events.onWindowOpen = function (window) {
  wcaCore.onWindowOpen(window)
}
events.onMessage = function (message) {
  const messageMotd = String(message.toMotd())
  const messageString = String(message.toString())
  const messageAnsi = String(message.toAnsi())
  msg.onMessage(message, messageString, messageMotd, messageAnsi)
}
events.onBossBarUpdated = function (bossBar) {
  msg.onBossBarUpdated(bossBar)
}

module.exports = events
