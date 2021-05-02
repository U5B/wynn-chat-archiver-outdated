const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'switch',
  description: 'switch worlds',
  permissionRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    switch (args[0]) {
      case undefined: {
        main.wca.core.switch('Discord', true)
        message.channel.send('switching to optimal world')
        break
      }
      default: {
        const validWorldRegex = /(\d|\d\d|WC\d|WC\d\d)/
        switch (validWorldRegex.test(args[0])) {
          case true: {
            main.wca.core.switch('Discord', true, args[0])
            message.channel.send(`switching to ${args[0]}`)
            break
          }
          default: {
            main.wca.core.switch('Discord', true)
            message.channel.send('switching to optimal world')
            break
          }
        }
      }
    }
  }
}
