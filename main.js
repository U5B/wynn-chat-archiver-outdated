const color = require('./modules/colors')
const simplediscord = require('./modules/simplediscord')
const log = require('./modules/logging')
const files = require('./modules/files')
const wcabomb = require('./modules/bomb')
const wcaguild = require('./modules/guild')
const wcaAPI = require('./modules/api')
const wcaResourcePack = require('./modules/plugins/resourcepack')
const wcaOnEnd = require('./modules/plugins/onEnd')
const wcaCore = require('./modules/plugins/core')
const wcaOnMessage = require('./modules/plugins/onMessage')
const universal = require('./modules/universal')
const events = require('./modules/plugins/events')

module.exports = {
  universal: universal,
  color: color,
  simplediscord: simplediscord,
  log: log,
  files: files,
  wca: {
    events: events,
    bomb: wcabomb,
    guild: wcaguild,
    api: wcaAPI,
    resourcePack: wcaResourcePack,
    onEnd: wcaOnEnd,
    core: wcaCore,
    onMessage: wcaOnMessage
  }
}
