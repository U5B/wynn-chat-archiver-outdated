const config = require('../config/config.json')
const wcaguild = require('../guild')

module.exports = {
  name: 'territory',
  description: 'developer was too lazy too add a description, sorry',
  permissionRoles: [],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  async execute (message, args, customs) {
    if (!args.length) {
      message.channel.send('Specify a territroy for it\'s location')
    } else if (args[0]) {
      const argument1 = args[0]
      const answer = await wcaguild.territoryLocation(argument1)
      if (answer === null) {
        message.channel.send('Internal error occured')
        return
      }
      message.channel.send(answer)
    }
  }
}
