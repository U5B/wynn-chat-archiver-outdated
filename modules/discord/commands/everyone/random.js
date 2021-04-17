const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'random',
  description: 'returns a random player on that specific world',
  permissionRoles: [],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  async execute (message, args, customs) {
    if (!args.length) {
      message.channel.send('Specify a world to fetch a random player')
    } else if (args[0]) {
      const answer = await main.files.getRandomPlayer(args[0])
      message.channel.send(`\`${answer}\``)
    }
  }
}
