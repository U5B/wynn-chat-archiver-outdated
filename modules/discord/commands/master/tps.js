const config = require('../../../config/config.json')

module.exports = {
  name: 'tps',
  description: 'returns current world and tps',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    const tps = customs.bot.getTps()
    message.channel.send(`[${customs.universal.currentWorld}] TPS: ${tps}`)
  }
}
