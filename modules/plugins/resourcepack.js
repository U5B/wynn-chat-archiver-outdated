const config = require('../config/config.json')
const universal = require('../univariables.js')
const log = require('../logging.js')
const simplediscord = require('../simplediscord.js')

const resourcepack = {}
let resourcePackSendListener
resourcepack.resourcePackAccept = function () {
  log.warn('Connected && Loading Resource Pack...')
  // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.worldReconnectMessage}`)
  simplediscord.sendTime(config.statusChannel, `${config.worldReconnectMessage} [Resource Pack]`)
  universal.compassCheck.set(false)
  // COMMENT: resoucePackLoading is used for waiting for the resource pack to load
  universal.resourcePackLoading.set(true)
  if (resourcePackSendListener) universal.bot.get().removeListener('resource_pack_send', resourcePackSendListener)
  simplediscord.status() // COMMENT: check discord status
  // COMMENT: Accept the resource pack on login: Thanks mat#6207 for giving the code
  resourcePackSendListener = function onceResourcePackSend () {
    universal.bot.get()._client.write('resource_pack_receive', {
      result: 3
    })
    universal.bot.get()._client.write('resource_pack_receive', {
      result: 0
    })
    log.log('Wynnpack accepted.')
    universal.resourcePackLoading.set(false)
  }
  universal.bot.get()._client.once('resource_pack_send', resourcePackSendListener)
}
module.exports = resourcepack
