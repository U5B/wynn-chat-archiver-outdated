const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'housing',
  description: 'housing commands',
  permissionRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    if (config.state.housingTracker) {
      if (!args.length) {
        message.channel.send(`${config.discord.prefix}housing <invite|kick|ban|unban|start|end|public> [player|all|true]`)
      } else if (args[0] === 'invite') {
        if (main.universal.state.onHousing) {
          message.channel.send('not on house')
          return
        }
        if (!args[1]) {
          message.channel.send('specify a player')
        } else {
          main.wca.housing.playerInvite(args[1])
        }
      } else if (args[0] === 'kick') {
        if (main.universal.state.onHousing) {
          message.channel.send('not on house')
          return
        }
        if (!args[1]) {
          message.channel.send('specify a player or "!all"')
        } else if (args[1] === '!all') {
          main.wca.housing.playerKick('uwu', true)
        } else {
          main.wca.housing.playerKick([args[1], false])
        }
      } else if (args[0] === 'ban') {
        if (main.universal.state.onHousing) {
          message.channel.send('not on house')
          return
        }
        if (!args[1]) {
          message.channel.send('specify a player')
        } else {
          main.wca.housing.playerBan(args[1], false)
        }
      } else if (args[0] === 'unban') {
        if (main.universal.state.onHousing) {
          message.channel.send('not on house')
          return
        }
        if (!args[1]) {
          message.channel.send('specify a player')
        } else {
          main.wca.housing.playerBan(args[1], true)
        }
      } else if (args[0] === 'start') {
        if (main.universal.state.onHousing) {
          message.channel.send('error: already in ma house ;-;')
        } else {
          main.wca.housing.start()
        }
      } else if (args[0] === 'end') {
        if (main.universal.state.onHousing) {
          main.wca.housing.leave(true)
        } else {
          message.channel.send('error: already in ma house ;-;')
        }
      } else if (args[0] === 'public') {
        if (main.universal.state.onHousing) {
          message.channel.send('not on house')
          return
        }
        if (!args[1]) {
          message.channel.send('mode not selected, defaulting to true')
        }
        if (args[1] === 'false') {
          if (main.universal.state.housingPublic === true) {
            main.wca.housing.public(false)
          }
        } else {
          if (main.universal.state.housingPublic === false) {
            main.wca.housing.public(true)
          }
        }
      }
    } else {
      message.channel.send('housing disabled')
    }
  }
}
