const config = require('../../../config/config.js')
const main = require('../../../../main.js')

module.exports = {
  name: 'housing',
  description: 'housing commands',
  permissionRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    if (!config.state.housingTracker) return message.channel.send(`housing: ${main.universal.state.housingTracker}`)
    switch (args[0]) {
      case 'start': {
        if (main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        main.wca.housing.start()
        break
      }
      case 'restart': {
        if (!main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        main.wca.housing.restart()
        break
      }
      case 'stop': {
        if (!main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        main.wca.housing.leave(true)
        break
      }
      case 'invite': {
        if (!main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        switch (args[1]) {
          case undefined: {
            message.channel.send(`${config.discord.prefix}housing invite <player>`)
            break
          }
          default: {
            main.wca.housing.playerInvite(args[1])
            message.channel.send(`Invited \`${args[1]}\``)
            break
          }
        }
        break
      }
      case 'edit': {
        if (!main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        switch (args[1]) {
          case undefined: {
            message.channel.send(`${config.discord.prefix}housing edit <player> <true/false>`)
            break
          }
          default: {
            switch (args[2]) {
              case 'true': {
                message.channel.send(`Edit Permissions for \`${args[1]}\`: true`)
                main.wca.housing.playerEdit(args[1], true)
                break
              }
              case 'false': {
                message.channel.send(`Edit Permissions for \`${args[1]}\`: false`)
                main.wca.housing.playerEdit(args[1], false)
                break
              }
              default: {
                message.channel.send(`Edit Permissions for \`${args[1]}\`: true`)
                main.wca.housing.playerEdit(args[1], true)
                break
              }
            }
            break
          }
        }
        break
      }
      case 'kick': {
        if (!main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        switch (args[1]) {
          case undefined: {
            message.channel.send(`${config.discord.prefix}housing kick <player|all>`)
            break
          }
          case 'all': {
            message.channel.send('Kicked everyone.')
            main.wca.housing.playerKick(args[1], true)
            break
          }
          default: {
            message.channel.send(`Kicked \`${args[1]}\``)
            main.wca.housing.playerKick(args[1], false)
            break
          }
        }
        break
      }
      case 'ban': {
        if (!main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        switch (args[1]) {
          case undefined: {
            message.channel.send(`${config.discord.prefix}housing ban <player> <true|false>`)
            break
          }
          default: {
            switch (args[2]) {
              case 'true': {
                message.channel.send(`Banned \`${args[1]}\`: true`)
                main.wca.housing.playerBan(args[1], true)
                break
              }
              case 'false': {
                message.channel.send(`Unbanned \`${args[1]}\`: false`)
                main.wca.housing.playerBan(args[1], false)
                break
              }
              default: {
                message.channel.send(`Banned \`${args[1]}\`: true`)
                main.wca.housing.playerBan(args[1], true)
                break
              }
            }
            break
          }
        }
        break
      }
      case 'public': {
        if (!main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        switch (args[1]) {
          case 'true': {
            if (main.universal.state.housing.public === true) return message.channel.send(`public: ${main.universal.state.housing.public}`)
            main.wca.housing.public(true)
            message.channel.send(`public: ${main.universal.state.housing.public}`)
            break
          }
          case 'false': {
            if (main.universal.state.housing.public === false) return message.channel.send(`public: ${main.universal.state.housing.public}`)
            main.wca.housing.public(false)
            message.channel.send(`public: ${main.universal.state.housing.public}`)
            break
          }
          default: {
            message.channel.send(`public: ${main.universal.state.housing.public}\n${config.discord.prefix}housing public <true/false>`)
            break
          }
        }
        break
      }
      case 'list': {
        if (!main.universal.state.housing.online) return message.channel.send(`onHouse: ${main.universal.state.housing.online}`)
        message.channel.send(main.universal.state.housing.playerList)
        break
      }
      default: {
        message.channel.send(`${config.discord.prefix}housing <invite|kick||ban|start|stop|public|list> [player] [true|false]`)
        break
      }
    }
  }
}
