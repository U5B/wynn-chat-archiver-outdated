const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'start',
  description: 'start the program',
  permissionRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    if (main.universal.state.onWynncraft) {
      message.channel.send(`Already online, type ${config.prefix}stop to quit Wynncraft.`)
      return
    }
    main.wca.onEnd.onRestart('discord')
    main.log.warn(`WCA has joined game - due to ${config.prefix}start from Discord.`)
    message.channel.send('starting WCA')

    // main.simplediscord.sendTime(config.statusChannel, `${config.startWCA}`)
  }
}
