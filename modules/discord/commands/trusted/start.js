const config = require('../../../config/config.json')

module.exports = {
  name: 'start',
  description: 'start the bot',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    if (customs.universal.onWynncraft === true) {
      message.channel.send(`Already online, type ${config.prefix}stop to quit Wynncraft.`)
      return
    }
    customs.wcabotend.onRestart('discord')
    customs.log.warn(`WCA has joined game - due to ${config.prefix}start from Discord.`)
    message.channel.send('starting WCA')
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.startWCA}`)
    // customs.simplediscord.sendTime(config.statusChannel, `${config.startWCA}`)
  }
}
