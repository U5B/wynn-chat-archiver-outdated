const config = require('../../../config/config.js')

module.exports = {
  name: 'null',
  description: 'returns null',
  permissionRoles: [],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    message.channel.send('null')
  }
}
