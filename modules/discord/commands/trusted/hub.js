const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'hub',
  description: 'go to hub',
  permissionRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    main.wca.core.hub('Discord', true)
    main.log.warn('going to hub...')
    message.channel.send('going to hub...')
  }
}
