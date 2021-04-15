const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'stop',
  description: 'stop the program',
  permissionRoles: [config.masterDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    if (!main.universal.state.onWynncraft) {
      message.channel.send(`Already offline, type ${config.prefix}start to connect tp Wynncraft.`)
      return
    }
    main.wca.onEnd.onKick('end_discord')
    main.log.warn(`WCA has quit game due to ${config.prefix}stop from discord`)
    message.channel.send(`WCA has quit game due to discord - type ${config.prefix}start to start it`)
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.stopWCA}`)
    main.simplediscord.sendTime(config.statusChannel, `${config.stopWCA}`)
  }
}
