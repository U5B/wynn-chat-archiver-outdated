const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'stream',
  description: 'toggle stream mode',
  permissionRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    main.universal.droid.chat('/stream')
    message.channel.send('Toggled stream mode.')
  }
}
