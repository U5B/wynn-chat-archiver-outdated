const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'compass',
  description: 'force a compass check',
  permissionRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    main.wca.core.compass()
    main.log.warn('executing compass script')
    message.channel.send('executing compass script')
  }
}
