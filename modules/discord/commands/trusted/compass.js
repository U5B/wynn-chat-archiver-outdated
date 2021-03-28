const config = require('../../../config/config.json')

module.exports = {
  name: 'compass',
  description: 'force a compass check',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    if (customs.universal.onAWorld === true) {
      message.channel.send('fail: already on a world')
      return
    }
    if (customs.universal.onWynncraft === false) {
      message.channel.send('fail: offline')
      return
    }
    customs.wcacore.compass()
    customs.log.warn('executing compass script')
    message.channel.send('executing compass script')
  }
}
