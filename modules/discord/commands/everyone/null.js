const config = require('../../../config/config.json')

module.exports = {
  name: 'null',
  description: 'returns null',
  permissionRoles: [],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    message.channel.send('null')
  }
}
