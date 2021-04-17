const config = require('../config/config.js')
const universal = require('../universal.js')
const log = require('../logging.js')
const simplediscord = require('../simplediscord.js')

const resourcePack = {}
let resourcePackSendListener
resourcePack.resourcePackAccept = function () {
  log.warn('Connected && Loading Resource Pack...')
  simplediscord.sendTime(config.discord.log.statusChannel, `${config.msg.resourcePack}`)
  universal.state.compassCheck = false
  // COMMENT: resoucePackLoading is used for waiting for the resource pack to load
  universal.state.serverSwitch = true
  if (resourcePackSendListener) universal.droid.removeListener('resource_pack_send', resourcePackSendListener)
  simplediscord.status() // COMMENT: check discord status
  // COMMENT: Accept the resource pack on login: Thanks mat#6207 for giving the code
  resourcePackSendListener = function onceResourcePackSend (data) {
    log.log(data)
    universal.droid._client.write('resource_pack_receive', {
      result: 3
    })
    universal.droid._client.write('resource_pack_receive', {
      result: 0
    })
    log.log('Wynnpack accepted.')
    // COMMENT: Your now on a world - you have stopped loading resource pack lol
    // COMMENT: fire this in-case the online indicator doesn't fire ;-;
    universal.state.onWorld = true
    universal.state.serverSwitch = false
  }
  universal.droid._client.once('resource_pack_send', resourcePackSendListener)
}
module.exports = resourcePack
