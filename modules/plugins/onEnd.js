const config = require('../config/config.js')
const universal = require('../universal')
const log = require('../logging')
const simplediscord = require('../simplediscord')
const { client, login } = require('../../index')

const onEnd = {}
let loginAgain = false
onEnd.onKick = async function (reason, loggedIn) {
  universal.state.disconnected = true
  log.error(`KickReason: "${reason}" || LoginState: "${loggedIn}" || Type: ${typeof reason}`)
  if (loggedIn === true) loginAgain = true
  switch (typeof reason) {
    case ('string'): {
      switch (reason) {
        case 'end_discord': {
          universal.droid.quit()
          log.warn('Disconnected due to discord.')
          break
        }
        case 'end_process': {
          if (universal.droid != null) universal.droid.quit()
          log.warn('Disconnected due to process dying.')
          simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.processEndMessage} <@!${config.discord.admin.masterUser}>`)
          client.user.setStatus('invisible')
          await universal.sleep(5000)
          log.error('Exiting process NOW')
          process.exit()
        }
        case 'server_restart': {
          log.warn('Disconnected due to server restart.')
          simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`Server Restart\` <@!${config.discord.admin.masterUser}>`)
          onEnd.onRestart()
          break
        }
        default: {
          const JSONreason = JSON.parse(reason)
          log.verbose(reason)
          switch (JSONreason.text) {
            case '': {
              switch (JSONreason.extra[1].text) {
                case 'You are already logged on to Wynncraft.': {
                  if (loginAgain === true) universal.state.disconnected = false
                  simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [Login_Error] <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
                  loginAgain = false
                  break
                }
                case 'All lobbies are currently full.': {
                  universal.state.disconnected = false
                  simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [Lobby_Full] <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
                  break
                }
                default: {
                  simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
                  break
                }
              }
              break
            }
            case ('ReadTimeoutException : null'): {
              universal.state.disconnected = false
              simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [Timeout_Error] <@!${config.discord.admin.masterUser}>`)
              log.warn('Autorestarting...')
              break
            }
            case ('Could not connect to a default or fallback server, please try again later: io.netty.channel.ConnectTimeoutException'): {
              universal.state.disconnected = false
              simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [Lobby_Error] <@!${config.discord.admin.masterUser}>`)
              log.warn('Autorestarting...')
              break
            }
            default: {
              simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
              log.error(`Invalid string sent: "${reason}"`)
              break
            }
          }
          break
        }
      }
      break
    }
    /*
    default: {
      switch (reason.text) {
        case '': {
          switch (reason) {
            case (reason.extra[1].text === 'You are already logged on to Wynncraft.'): {
              if (loginCounter === 0) universal.state.disconnected = false
              simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [Login_Error] <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
              break
            }
            default: {
              simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
              break
            }
          }
          break
        }
        case ('ReadTimeoutException : null'): {
          universal.state.disconnected = false
          simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [AutoRestart] <@!${config.discord.admin.masterUser}>`)
          log.warn('Autorestarting...')
          break
        }
        case ('Could not connect to a default or fallback server, please try again later: io.netty.channel.ConnectTimeoutException'): {
          universal.state.disconnected = false
          simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [AutoRestart] <@!${config.discord.admin.masterUser}>`)
          log.warn('Autorestarting...')
          break
        }
        default: {
          simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
          break
        }
      }
      break
    }
    */
  }
  /*
  if (reason === 'end_discord') {
    universal.droid.quit()
    log.warn('Disconnected due to discord.')
  } else if (reason === 'end_process') {
    if (universal.droid != null) universal.droid.quit()
    log.warn('Disconnected due to process dying.')
    simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.processEndMessage} <@!${config.discord.admin.masterUser}>`)
    client.user.setStatus('invisible')
    await universal.sleep(5000)
    log.error('Exiting process NOW')
    process.exit()
  } else if (reason === 'server_restart') {
    log.warn('Disconnected due to server restart.')
    simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`Server Restart\` <@!${config.discord.admin.masterUser}>`)
    onEnd.onRestart()
  } else if (reason === '{"text":"ReadTimeoutException : null"}') {
    universal.state.disconnected = false
    simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [AutoRestart] <@!${config.discord.admin.masterUser}>`)
  } else if (reason === '{"text":"Could not connect to a default or fallback server, please try again later: io.netty.channel.ConnectTimeoutException","color":"red"}') {
    universal.state.disconnected = false
    simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [AutoRestart] <@!${config.discord.admin.masterUser}>`)
  } else if (reason === '{"text":"","extra":[{"text":"⚠ ","color":"dark_red"},{"text":"You are already logged on to Wynncraft.","color":"red"},{"text":"\nPlease try to join again in a few minutes.","color":"gray"}]}') {
    simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` [Login_Error] <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
  } else {
    simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`${reason}\` <@!${config.discord.admin.masterUser}> <@&${config.discord.admin.masterRole}>`)
  }
  */
}
onEnd.onEnd = async function (reason) {
  if (reason == null) {
    reason = 'user_disconnect'
  } else {
    universal.droid.quit()
  }
  // COMMENT: Shut down when kicked or disconnected
  universal.state.onlineWynn = false
  universal.state.onlineWorld = false
  universal.state.serverSwitch = false
  universal.state.housing.online = false
  simplediscord.status() // COMMENT: check discord status // COMMENT: check discord status
  clearInterval(universal.timer.cancelCompassTimer)
  // clearInterval(npcInterval)
  log.error(`DisconnectReason: "${reason}" || DisconnectState: "${universal.state.disconnected}"`)
  if (!universal.state.disconnected) {
    simplediscord.sendDate(config.discord.log.statusChannel, `${config.msg.kickMessage} \`Disconnected...\` <@!${config.discord.admin.masterUser}>`)
    log.warn('Disconnected. Attempting to reconnect...')
    onEnd.onRestart()
  }
}
onEnd.onRestart = async function (state) {
  universal.state.disconnected = false
  clearTimeout(universal.timer.cancelLoginTimer)
  universal.droid.quit()
  // COMMENT: The server you were previously on went down, you have been connected to a fallback server
  // COMMENT: Server restarting!
  // COMMENT: The server is restarting in 10 seconds.
  // COMMENT: The server is restarting in 5 seconds.
  // COMMENT: The server is restarting in 1 second.
  if (state === 'discord') {
    simplediscord.sendTime(config.discord.log.statusChannel, `${config.msg.startWCA} [Restart]`)
    login()
  } else {
    simplediscord.sendTime(config.discord.log.statusChannel, `${config.msg.startWCA} [Restart_5s]`)
    universal.timer.cancelLoginTimer = setTimeout(() => {
      login()
    }, 5000)
  }
}
module.exports = onEnd
