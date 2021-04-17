const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'exit',
  description: 'stops the process',
  permissionRoles: [config.discord.admin.masterRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    main.log.warn('exiting via discord uwu')
    message.channel.send('exiting process')
    process.emit('SIGINT')
  }
}
