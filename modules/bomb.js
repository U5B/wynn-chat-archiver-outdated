const config = require('./config/config.js')
const { client } = require('../index.js')
const log = require('./logging.js')
const files = require('./files.js')
const Timer = require('easytimer.js').Timer
const universal = require('./universal.js')
const simplediscord = require('./simplediscord.js')
const wcaCore = require('./plugins/core.js')
const wcaBomb = {}

wcaBomb.logBomb = async function (fullMessage, username, bomb, world) {
  // COMMENT: track some explosions
  log.log(`${bomb} bomb logged`)
  const bombUsername = await simplediscord.noMarkdown(username)
  const bombMessagePrefix = `[${new Date(Date.now()).toLocaleTimeString('en-US')}]` + ''
  const bombMessageSuffix = `**${world}** by ${bombUsername}`
  const playerCount = await files.listOnline(world)
  // COMMENT: adjust this number and the number in bombCountDown() to the max playercount
  const playerCountMax = '40'
  // COMMENT: Sort the bombs
  if (bomb === 'Combat XP') {
    const bombTime = 20 // COMMENT: duration of bomb
    const bombRole = config.discord.bomb.combatXPRole ? config.discord.bomb.combatXPRole : '[Combat XP]' // COMMENT: what bomb it is
    const bombEmoji = config.discord.bomb.combatXPEmoji ? config.discord.bomb.combatXPEmoji : '💣' // COMMENT: fancy emoji
    const bombChannel = config.discord.bomb.combatXPChannel ? config.discord.bomb.combatXPChannel : config.discord.bomb.channel // COMMENT: which channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}` // COMMENT: actual message
    const timerMessage = ` (**${bombTime}:00** left) **[${playerCount}/${playerCountMax}]**` // COMMENT: display duration of bomb and playercount/max
    const msg = await client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage) // COMMENT: send it
    bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax) // COMMENT: start a timer
    files.writeBombStats(world, bomb) // COMMENT: write it to a file
  } else if (bomb === 'Dungeon') {
    const bombTime = 10
    const bombRole = config.discord.bomb.dungeonRole ? config.discord.bomb.dungeonRole : '[Dungeon]'
    const bombEmoji = config.discord.bomb.dungeonEmoji ? config.discord.bomb.dungeonEmoji : '💣'
    const bombChannel = config.discord.bomb.dungeonChannel ? config.discord.bomb.dungeonChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}:00** left) **[${playerCount}/${playerCountMax}]**`
    const msg = await client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
    bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
    files.writeBombStats(world, bomb)
  } else if (bomb === 'Loot') {
    const bombTime = 20
    const bombRole = config.discord.bomb.lootRole ? config.discord.bomb.lootRole : '[Loot]'
    const bombEmoji = config.discord.bomb.lootEmoji ? config.discord.bomb.lootEmoji : '💣'
    const bombChannel = config.discord.bomb.lootChannel ? config.discord.bomb.lootChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}:00** left) **[${playerCount}/${playerCountMax}]**`
    const msg = await client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
    bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
    files.writeBombStats(world, bomb)
  } else if (bomb === 'Profession Speed') {
    const bombTime = 10
    const bombRole = config.discord.bomb.professionSpeedRole ? config.discord.bomb.professionSpeedRole : '[Profession Speed]'
    const bombEmoji = config.discord.bomb.professionSpeedEmoji ? config.discord.bomb.professionSpeedEmoji : '💣'
    const bombChannel = config.discord.bomb.professionSpeedChannel ? config.discord.bomb.professionSpeedChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}:00** left) **[${playerCount}/${playerCountMax}]**`
    const msg = await client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
    bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
    files.writeBombStats(world, bomb)
  } else if (bomb === 'Profession XP') {
    const bombTime = 20
    const bombRole = config.discord.bomb.professionXPRole ? config.discord.bomb.professionXPRole : '[Profession XP]'
    const bombEmoji = config.discord.bomb.professionXPEmoji ? config.discord.bomb.professionXPEmoji : '💣'
    const bombChannel = config.professionXPChannel ? config.discord.bomb.professionXPChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}:00** left) **[${playerCount}/${playerCountMax}]**`
    const msg = await client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
    bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
    files.writeBombStats(world, bomb)
  } else {
    // COMMENT: If it doesn't match: (Combat XP, Loot, Dungeon, Profession Speed, Profession XP) then log the error
    log.error(bomb)
  }
  client.guilds.cache.get(config.discord.guildid).channels.cache.get(config.discord.bomb.logBombChannel).send(`[${new Date(Date.now()).toLocaleTimeString('en-US')}] ${fullMessage}`)
}

function bombCountDown (msg, message, duration, world, playerCountMax) {
  universal.api.bombArray.push(world) // COMMENT: add it to a list of worlds to ignore
  const timer = new Timer()
  timer.start({ countdown: true, startValues: { minutes: duration }, target: { minutes: 0 }, precision: 'seconds' }) // COMMENT: start a timer for that bomb
  timer.addEventListener('secondsUpdated', async () => {
    const timeLeftMinutes = timer.getTimeValues().minutes
    const timeLeftSeconds = timer.getTimeValues().seconds
    if (timeLeftSeconds === 0 || timeLeftSeconds === 30) {
      if (timeLeftMinutes === 0 && timeLeftSeconds === 0) {
        // COMMENT: target is met (0 minutes), delete message and stop timer
        universal.api.bombArray.splice(world, 1) // COMMENT: remove it from a list of worlds to ignore
        msg.delete().then(log.log('Bomb Message deleted'))
      } else {
        const playerCount = await files.listOnline(world)
        msg.edit(message + ` (**${timer.getTimeValues().toString(['minutes', 'seconds'])} left)** **[${playerCount}/${playerCountMax}]**`) // COMMENT: edit the message every 30s with updated playercount and duration
      }
    }
  })
}
wcaBomb.bossBarBomb = function (duration) {
  // COMMENT: This catches bombs that are already on the world
  if (config.state.ignoreBombs) return
  clearTimeout(universal.timer.hubTimer)
  const world = universal.info.currentWorld
  const waitTime = duration * 60000 + 60000 // COMMENT: duration + 1 minute
  wcaCore.hub('Bomb_BossBar')
  universal.api.bombArray.push(world)
  setTimeout(() => {
    universal.api.bombArray.splice(world, 1)
  }, waitTime)
}
wcaBomb.bombThanks = function () {
  // COMMENT: This catches bombs that don't have timers
  if (config.state.ignoreBombs) return
  universal.timer.hubTimer = setTimeout(() => {
    log.log(`going to hub because bomb was thrown on ${universal.info.currentWorld}`)
    wcaCore.hub('Bomb_Thanks')
    const world = universal.info.currentWorld
    universal.api.bombArray.push(world)
    setTimeout(() => {
      universal.api.bombArray.splice(world, 1)
    }, 600000) // COMMENT: 10 minutes
  }, 5000)
}
module.exports = wcaBomb
