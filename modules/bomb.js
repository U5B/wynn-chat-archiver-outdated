const config = require('./config/config.js')
const { client } = require('../index.js')
const log = require('./logging.js')
const files = require('./files.js')
const Timer = require('easytimer.js').Timer
const universal = require('./universal.js')
const simplediscord = require('./simplediscord.js')
const wcaBomb = {}

wcaBomb.logBomb = function (fullMessage, username, bomb, world) {
  // COMMENT: track some explosions
  log.log(`${bomb} bomb logged`)
  const bombUsername = simplediscord.noMarkdown(username)
  const bombMessagePrefix = `[${new Date(Date.now()).toLocaleTimeString('en-US')}]` + ''
  const bombMessageSuffix = `**${world}** by ${bombUsername}`
  const playerCount = files.listOnline(world)
  // COMMENT: adjust this number and the number in bombCountDown() to the max playercount
  const playerCountMax = '40'
  // COMMENT: Sort the bombs
  if (bomb === 'Combat XP') {
    const bombTime = 20
    const bombRole = config.discord.bomb.combatXPRole ? config.discord.bomb.combatXPRole : '[Combat XP]'
    const bombEmoji = config.discord.bomb.combatXPEmoji ? config.discord.bomb.combatXPEmoji : '💣'
    const bombChannel = config.discord.bomb.combatXPChannel ? config.discord.bomb.combatXPChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    // COMMENT: display duration of bomb and playercount/max
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
    files.writeBombStats(world, bomb)
  } else if (bomb === 'Dungeon') {
    const bombTime = 10
    const bombRole = config.discord.bomb.dungeonRole ? config.discord.bomb.dungeonRole : '[Dungeon]'
    const bombEmoji = config.discord.bomb.dungeonEmoji ? config.discord.bomb.dungeonEmoji : '💣'
    const bombChannel = config.discord.bomb.dungeonChannel ? config.discord.bomb.dungeonChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
    files.writeBombStats(world, bomb)
  } else if (bomb === 'Loot') {
    const bombTime = 20
    const bombRole = config.discord.bomb.lootRole ? config.discord.bomb.lootRole : '[Loot]'
    const bombEmoji = config.discord.bomb.lootEmoji ? config.discord.bomb.lootEmoji : '💣'
    const bombChannel = config.discord.bomb.lootChannel ? config.discord.bomb.lootChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
    files.writeBombStats(world, bomb)
  } else if (bomb === 'Profession Speed') {
    const bombTime = 10
    const bombRole = config.discord.bomb.professionSpeedRole ? config.discord.bomb.professionSpeedRole : '[Profession Speed]'
    const bombEmoji = config.discord.bomb.professionSpeedEmoji ? config.discord.bomb.professionSpeedEmoji : '💣'
    const bombChannel = config.discord.bomb.professionSpeedChannel ? config.discord.bomb.professionSpeedChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
    files.writeBombStats(world, bomb)
  } else if (bomb === 'Profession XP') {
    const bombTime = 20
    const bombRole = config.discord.bomb.professionXPRole ? config.discord.bomb.professionXPRole : '[Profession XP]'
    const bombEmoji = config.discord.bomb.professionXPEmoji ? config.discord.bomb.professionXPEmoji : '💣'
    const bombChannel = config.professionXPChannel ? config.discord.bomb.professionXPChannel : config.discord.bomb.channel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.discord.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
    files.writeBombStats(world, bomb)
  } else {
    // COMMENT: If it doesn't match: (Combat XP, Loot, Dungeon, Profession Speed, Profession XP) then log the error
    log.error(bomb)
  }
  client.guilds.cache.get(config.discord.guildid).channels.cache.get(config.discord.bomb.logBombChannel).send(`[${new Date(Date.now()).toLocaleTimeString('en-US')}] ${fullMessage}`)
}

function bombCountDown (msg, message, duration, world, playerCountMax) {
  universal.api.bombArray.push(world)
  const timer = new Timer()
  let counter = 0
  timer.start({ countdown: true, startValues: { minutes: duration }, target: { minutes: 0 }, precision: 'seconds' })
  // COMMENT: target is met (0 minutes), delete message and stop timer
  timer.addEventListener('targetAchieved', () => {
    universal.api.bombArray.splice(world, 1)
    msg.delete()
      .then(log.log('Bomb Message deleted'))
    timer.stop()
  }) // COMMENT: otherwise edit the message with the current time left
  timer.addEventListener('secondsUpdated', async () => {
    counter = counter + 1
    if (counter < 30) return
    counter = 0
    const timeLeftMinutes = timer.getTimeValues().minutes
    const timeLeftSeconds = timer.getTimeValues().seconds
    if (timeLeftMinutes === 0) return
    if (timeLeftSeconds === 0 || timeLeftSeconds === 30) {
      const playerCount = files.listOnline(world)
      msg.edit(message + ` (**${timeLeftMinutes} minutes** left) **[${playerCount}/${playerCountMax}]**`)
    }
  })
}

module.exports = wcaBomb
