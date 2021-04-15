const config = require('../../../config/config.json')
const main = require('../../../../main.js')

module.exports = {
  name: 'sudo',
  description: 'eval but only for chat',
  permissionRoles: [config.masterDiscordRole],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    const sudoMessage = args.join(' ')
    main.log.warn(`executed "${sudoMessage}"`)
    main.universal.droid.chat(sudoMessage)
    message.channel.send(`executed \`${sudoMessage}\``)
  }
}
