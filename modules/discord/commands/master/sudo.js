const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'sudo',
  description: 'eval but only for chat',
  permissionRoles: [config.discord.admin.masterRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    const sudoMessage = args.join(' ')
    main.log.warn(`executed "${sudoMessage}"`)
    main.universal.droid.chat(sudoMessage)
    message.channel.send(`executed \`${sudoMessage}\``)
  }
}
