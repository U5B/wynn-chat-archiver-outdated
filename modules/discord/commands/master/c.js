const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'c',
  description: 'send chat messages',
  permissionRoles: [config.discord.admin.masterRole],
  allowedRoles: [config.discord.admin.masterRole],
  allowedChannels: [config.discord.log.commandChannel, config.discord.log.chatChannel],
  execute (message, args, customs) {
    const sudoMessage = args.join(' ')
    main.log.warn(`${message.author.tag} executed "${sudoMessage}"`)
    main.universal.droid.chat(sudoMessage)
  }
}
