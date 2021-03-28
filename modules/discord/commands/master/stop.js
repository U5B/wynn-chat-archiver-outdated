const config = require('../../../config/config.json')

module.exports = {
  name: 'stop',
  description: 'stop the bot',
  permissionRoles: [config.masterDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    if (customs.universal.onWynncraft === false) {
      message.channel.send(`Already offline, type ${config.prefix}start to connect tp Wynncraft.`)
      return
    }
    customs.wcabotend.onKick('end_discord')
    customs.log.warn(`WCA has quit game due to ${config.prefix}stop from discord`)
    message.channel.send(`WCA has quit game due to discord - type ${config.prefix}start to start it`)
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.stopWCA}`)
    customs.simplediscord.sendTime(config.statusChannel, `${config.stopWCA}`)
  }
}
