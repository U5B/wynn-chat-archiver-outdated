const config = require('../config/config')
const universal = require('../univariables')
const log = require('../logging')
const simplediscord = require('../simplediscord')
const { client, sleep, loginBot } = require('../../index')

const botend = {}
botend.onKick = async function onKick (reason, loggedIn) {
  universal.disconnected = true
  let kickReason
  const reasonType = typeof reason
  if (reasonType === 'string') {
    kickReason = reason
  } else {
    kickReason = JSON.stringify(reason)
  }
  log.error(`KickReason: "${kickReason}" || LoginState: "${loggedIn}"`)
  if (kickReason === 'end_discord') {
    universal.bot.quit()
    log.warn('Disconnected due to discord.')
  } else if (kickReason === 'end_process') {
    if (universal.bot != null) universal.bot.quit()
    log.warn('Disconnected due to process dying.')
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(nowDate + ` ${config.processEndMessage} <@!${config.masterDiscordUser}>`)
    simplediscord.sendDate(config.statusChannel, `${config.processEndMessage} <@!${config.masterDiscordUser}>`)
    client.user.setStatus('invisible')
    await sleep(5000)
    log.error('Exiting process NOW')
    process.exit()
  } else if (kickReason === 'server_restart') {
    log.warn('Disconnected due to server restart.')
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.kickMessage} \`Server Restart\` <@!${config.masterDiscordUser}>`)
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`Server Restart\` <@!${config.masterDiscordUser}>`)
    botend.onRestart()
  } else if (kickReason === '{"text":"ReadTimeoutException : null"}') {
    universal.disconnected = false
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`${reason}\` <@!${config.masterDiscordUser}> <@&${config.masterDiscordRole}>`)
  } else if (kickReason === '{"text":"Could not connect to a default or fallback server, please try again later: io.netty.channel.ConnectTimeoutException","color":"red"}') {
    universal.disconnected = false
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`${reason}\` <@!${config.masterDiscordUser}> <@&${config.masterDiscordRole}>`)
  } else {
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.kickMessage} \`${reason}\` <@!${config.masterDiscordUser}> <@&${config.masterDiscordRole}>`)
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`${reason}\` <@!${config.masterDiscordUser}> <@&${config.masterDiscordRole}>`)
  }
}
botend.onEnd = async function onEnd (reason) {
  if (reason == null) {
    reason = 'user_disconnect'
  } else {
    universal.bot.quit()
  }
  // COMMENT: Shut all the bot things down when kicked or disconnected
  universal.onWynncraft = false
  universal.onAWorld = false
  universal.resourcePackLoading = false
  simplediscord.status() // COMMENT: check discord status // COMMENT: check discord status
  clearInterval(universal.cancelCompassTimer)
  // clearInterval(npcInterval)
  log.error(`DisconnectReason: "${reason}" || DisconnectState: "${universal.disconnected}"`)
  if (!universal.disconnected) {
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.kickMessage} \`Disconnected...\` <@!${config.masterDiscordUser}>`)
    simplediscord.sendDate(config.statusChannel, `${config.kickMessage} \`Disconnected...\` <@!${config.masterDiscordUser}>`)
    log.warn('Disconnected. Attempting to reconnect...')
    botend.onRestart()
  }
}
botend.onRestart = async function onRestart (state) {
  universal.disconnected = false
  clearTimeout(universal.cancelLoginTimer)
  await universal.bot.quit()
  // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.restartWCA}`)
  simplediscord.sendTime(config.statusChannel, `${config.restartWCA}`)
  // COMMENT: The server you were previously on went down, you have been connected to a fallback server
  // COMMENT: Server restarting!
  // COMMENT: The server is restarting in 10 seconds.
  // COMMENT: The server is restarting in 5 seconds.
  // COMMENT: The server is restarting in 1 second.
  if (state === 'discord') {
    loginBot()
  } else {
    universal.cancelLoginTimer = setTimeout(() => {
      loginBot()
    }, 5000)
  }
}
module.exports = botend
