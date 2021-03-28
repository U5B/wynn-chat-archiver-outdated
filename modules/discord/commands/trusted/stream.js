const config = require('../../../config/config.json')

module.exports = {
  name: 'stream',
  description: 'toggle stream mode',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    customs.bot.chat('/stream')
    message.channel.send('Toggled stream mode.')
  }
}
