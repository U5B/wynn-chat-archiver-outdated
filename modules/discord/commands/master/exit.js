const config = require('../../../config/config.json')

module.exports = {
  name: 'exit',
  description: 'exit\'s the bot and stops the process',
  permissionRoles: [config.masterDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    customs.log.warn('exiting via discord uwu')
    message.channel.send('exiting bot process')
    process.emit('SIGINT')
  }
}
