const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'stop',
  description: 'stop the program',
  permissionRoles: [config.discord.admin.masterRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    if (!main.universal.state.onlineWynn) {
      message.channel.send(`Already offline, type ${config.discord.prefix}start to connect tp Wynncraft.`)
      return
    }
    main.wca.onEnd.onKick('end_discord')
    main.log.warn(`WCA has quit game due to ${config.discord.prefix}stop from discord`)
    message.channel.send(`WCA has quit game due to discord - type ${config.discord.prefix}start to start it`)

    main.simplediscord.sendTime(config.discord.log.statusChannel, `${config.msg.stopWCA}`)
  }
}
