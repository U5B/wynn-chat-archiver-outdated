const config = require('../config/config.json')
module.exports = {
  name: 'bomb',
  description: 'get bomb stats of a specific world',
  permissionRoles: [],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    if (!args.length) {
      message.channel.send('Specify a world for stats')
    } else if (args[2]) {
      message.channel.send(`Too many arguments, try ${config.prefix}bomb WC0 Combat_XP or ${config.prefix}bomb WC0`)
    } else if (args[0]) {
      const answer = customs.fileCheck.getBombStats(args[0], args[1])
      if (answer === null) {
        message.channel.send('Internal error occured')
        return
      }
      message.channel.send(answer)
    }
  }
}
