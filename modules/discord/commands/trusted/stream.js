const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'stream',
  description: 'toggle stream mode',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    main.universal.droid.chat('/stream')
    message.channel.send('Toggled stream mode.')
  }
}
