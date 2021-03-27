const config = require('../config/config.json')

module.exports = {
  name: 'null',
  description: 'returns null',
  permissionRoles: [config.masterDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message) {
    message.channel.send('null')
  }
}
