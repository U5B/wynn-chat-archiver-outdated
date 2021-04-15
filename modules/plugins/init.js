const mineflayer = require('mineflayer')
const config = require('../config/config.json')
const cred = require('../config/cred.json')
const universal = require('../universal.js')
const events = require('./events.js')
const api = require('../api.js')
const init = {}
init.login = async function login () {
  const version = config.version
  const ip = process.argv[4] ? process.argv[4] : config.ip
  const port = process.argv[5] ? process.argv[5] : config.port
  const user = process.argv[2] ? process.argv[2] : cred.username
  const pass = process.argv[3] ? process.argv[3] : cred.password
  universal.droid = mineflayer.createBot({
    version: version,
    host: ip,
    port: port,
    username: user,
    password: pass,
    viewDistance: 'tiny',
    checkTimeoutInterval: 60000
  })
  api.WCStats.read()
  api.onlinePlayers()
  clearInterval(universal.timer.apiInterval)
  universal.timer.apiInterval = setInterval(() => {
    api.onlinePlayers()
  }, 30000)
  universal.droid.once('spawn', () => {
    events.onceSpawn()
  })
  universal.droid.on('spawn', () => {
    events.onSpawn()
  })
  universal.droid.once('login', () => {
    events.onceLogin()
  })
  universal.droid.on('login', () => {
    events.onLogin()
  })
  universal.droid.on('windowOpen', (window) => {
    events.onWindowOpen(window)
  })
  // COMMENT: This is special regexes for logging and when I can't detect special chats via chatAddPattern
  universal.droid.on('message', (message, pos) => {
    events.onMessage(message, pos)
  })
  universal.droid.on('bossBarUpdated', (bossBar) => {
    events.onBossBarUpdated(bossBar)
  })
  return 'done'
}
init.restart = function restart (state) {
  universal.state.disconnected = false
  clearTimeout(universal.timer.cancelLoginTimer)
  universal.droid.quit()
  // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.restartWCA}`)
  // COMMENT: The server you were previously on went down, you have been connected to a fallback server
  // COMMENT: Server restarting!
  // COMMENT: The server is restarting in 10 seconds.
  // COMMENT: The server is restarting in 5 seconds.
  // COMMENT: The server is restarting in 1 second.
  if (state === 'discord') {
    init.login()
  } else {
    universal.timer.cancelLoginTimer = setTimeout(() => {
      init.login()
    }, 5000)
  }
}

module.exports = init
