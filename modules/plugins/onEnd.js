const config = require('../config/config')
const universal = require('../universal')
const log = require('../logging')
const simplediscord = require('../simplediscord')
const { client, login } = require('../../index')

const onEnd = {}
onEnd.onKick = async function (reason, loggedIn) {
  universal.state.disconnected = true
  let kickReason
  const reasonType = typeof reason
  if (reasonType === 'string') {
    kickReason = reason
  } else {
    kickReason = JSON.stringify(reason)
  }
  log.error(`KickReason: "${kickReason}" || LoginState: "${loggedIn}"`)
  if (kickReason === 'end_discord') {
    universal.droid.quit()
    log.warn('Disconnected due to discord.')
  } else if (kickReason === 'end_process') {
    if (universal.droid != null) universal.droid.quit()
    log.warn('Disconnected due to process dying.')

    simplediscord.sendDate(config.statusChannel, `${config.processEndMessage} <@!${config.masterDiscordUser}>`)
    client.user.setStatus('invisible')
    await universal.sleep(5000)
    log.error('Exiting process NOW')
    process.exit()
  } else if (kickReason === 'server_restart') {
    log.warn('Disconnected due to server restart.')

    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`Server Restart\` <@!${config.masterDiscordUser}>`)
    onEnd.onRestart()
  } else if (kickReason === '{"text":"ReadTimeoutException : null"}') {
    universal.state.disconnected = false
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`${reason}\` [AutoRestart] <@!${config.masterDiscordUser}>`)
  } else if (kickReason === '{"text":"Could not connect to a default or fallback server, please try again later: io.netty.channel.ConnectTimeoutException","color":"red"}') {
    universal.state.disconnected = false
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`${reason}\` [AutoRestart] <@!${config.masterDiscordUser}>`)
  } else {
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`${reason}\` <@!${config.masterDiscordUser}> <@&${config.masterDiscordRole}>`)
  }
}
onEnd.onEnd = async function (reason) {
  if (reason == null) {
    reason = 'user_disconnect'
  } else {
    universal.droid.quit()
  }
  // COMMENT: Shut down when kicked or disconnected
  universal.state.onWynncraft = false
  universal.state.onWorld = false
  universal.state.serverSwitch = false
  simplediscord.status() // COMMENT: check discord status // COMMENT: check discord status
  clearInterval(universal.timer.cancelCompassTimer)
  // clearInterval(npcInterval)
  log.error(`DisconnectReason: "${reason}" || DisconnectState: "${universal.state.disconnected}"`)
  if (!universal.state.disconnected) {
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`Disconnected...\` <@!${config.masterDiscordUser}>`)
    log.warn('Disconnected. Attempting to reconnect...')
    onEnd.onRestart()
  }
}
onEnd.onRestart = async function (state) {
  simplediscord.sendTime(config.statusChannel, `${config.restartWCA}`)
  universal.state.disconnected = false
  clearTimeout(universal.timer.cancelLoginTimer)
  universal.droid.quit()

  // COMMENT: The server you were previously on went down, you have been connected to a fallback server
  // COMMENT: Server restarting!
  // COMMENT: The server is restarting in 10 seconds.
  // COMMENT: The server is restarting in 5 seconds.
  // COMMENT: The server is restarting in 1 second.
  if (state === 'discord') {
    login()
  } else {
    universal.timer.cancelLoginTimer = setTimeout(() => {
      login()
    }, 5000)
  }
}
module.exports = onEnd
