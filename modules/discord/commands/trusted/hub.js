const config = require('../../../config/config.json')

module.exports = {
  name: 'hub',
  description: 'go to hub',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    customs.wcabotlobby.hub('Discord')
    customs.log.warn('going to hub...')
    message.channel.send('going to hub...')
  }
}
