const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'compass',
  description: 'force a compass check',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    if (main.universal.state.onWorld) {
      message.channel.send('fail: already on a world')
      return
    }
    if (!main.universal.state.onWynncraft) {
      message.channel.send('fail: offline')
      return
    }
    main.wca.core.compass()
    main.log.warn('executing compass script')
    message.channel.send('executing compass script')
  }
}
