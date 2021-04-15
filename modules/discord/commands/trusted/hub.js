const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'hub',
  description: 'go to hub',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    main.wca.core.hub('Discord', true)
    main.log.warn('going to hub...')
    message.channel.send('going to hub...')
  }
}
