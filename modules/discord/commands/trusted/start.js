const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'start',
  description: 'start the bot',
  permissionRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    if (main.universal.state.onWynncraft) {
      message.channel.send(`Already online, type ${config.prefix}stop to quit Wynncraft.`)
      return
    }
    main.wca.onEnd.onRestart('discord')
    main.log.warn(`WCA has joined game - due to ${config.prefix}start from Discord.`)
    message.channel.send('starting WCA')
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.startWCA}`)
    // main.simplediscord.sendTime(config.statusChannel, `${config.startWCA}`)
  }
}
