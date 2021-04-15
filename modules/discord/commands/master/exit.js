const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'exit',
  description: 'stops the process',
  permissionRoles: [config.masterDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    main.log.warn('exiting via discord uwu')
    message.channel.send('exiting process')
    process.emit('SIGINT')
  }
}
