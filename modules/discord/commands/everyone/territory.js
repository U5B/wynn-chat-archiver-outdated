const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'territory',
  description: 'get territory location',
  permissionRoles: [],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  async execute (message, args, customs) {
    if (!args.length) {
      message.channel.send('Specify a territroy for it\'s location')
    } else if (args[0]) {
      const argument1 = args[0]
      const answer = await main.wca.guild.territoryLocation(argument1)
      if (answer === null) {
        message.channel.send('Internal error occured')
        return
      }
      message.channel.send(answer)
    }
  }
}
