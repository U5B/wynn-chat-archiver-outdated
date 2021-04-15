const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'exit',
  description: 'exit\'s the bot and stops the process',
  permissionRoles: [config.masterDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    main.log.warn('exiting via discord uwu')
    message.channel.send('exiting bot process')
    process.emit('SIGINT')
  }
}
