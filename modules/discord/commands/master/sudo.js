const config = require('../../../config/config.json')

module.exports = {
  name: 'sudo',
  description: 'eval but only for chat',
  permissionRoles: [config.masterDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    const sudoMessage = args.join(' ')
    customs.log.warn(`executed "${sudoMessage}"`)
    customs.bot.chat(sudoMessage)
    message.channel.send(`executed \`${sudoMessage}\``)
  }
}
