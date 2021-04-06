const config = require('./config/config.json')
const { client } = require('../index.js')
const log = require('./logging.js')
const files = require('./files.js')
const Timer = require('easytimer.js').Timer
const bomb = {}

bomb.logBomb = function logBombToDiscord (fullMessage, username, bomb, world, timeLeft) {
  // COMMENT: track some explosions
  log.log(`${bomb} bomb logged`)
  const bombMessagePrefix = `[${new Date(Date.now()).toLocaleTimeString('en-US')}]` + ''
  const bombMessageSuffix = `**${world}** by \`${username}\``
  const playerCount = files.listOnline(world)
  // COMMENT: adjust this number and the number in bombCountDown() to the max playercount
  const playerCountMax = '40'
  // COMMENT: Sort the bombs
  if (bomb === 'Combat XP') {
    let bombTime
    if (timeLeft === null) {
      bombTime = 20 // COMMENT: duration in minutes of the bomb when thrown (Combat XP is 20 minutes)
    } else {
      bombTime = timeLeft
    }
    const bombRole = config.combatXPRole ? config.combatXPRole : '[Combat XP]'
    const bombEmoji = config.combatXPEmoji ? config.CombatXPEmoji : '▶️'
    const bombChannel = config.combatXPChannel ? config.combatXPChannel : config.bombChannel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    // COMMENT: display duration of bomb and playercount/max
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
  } else if (bomb === 'Dungeon') {
    let bombTime
    if (timeLeft === null) {
      bombTime = 10
    } else {
      bombTime = timeLeft
    }
    const bombRole = config.dungeonRole ? config.dungeonRole : '[Dungeon]'
    const bombEmoji = config.dungeonEmoji ? config.dungeonEmoji : '▶️'
    const bombChannel = config.dungeonChannel ? config.dungeonChannel : config.bombChannel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
  } else if (bomb === 'Loot') {
    let bombTime
    if (timeLeft === null) {
      bombTime = 20
    } else {
      bombTime = timeLeft
    }
    const bombRole = config.lootRole ? config.lootRole : '[Loot]'
    const bombEmoji = config.lootEmoji ? config.lootEmoji : '▶️'
    const bombChannel = config.lootChannel ? config.lootChannel : config.bombChannel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
  } else if (bomb === 'Profession Speed') {
    let bombTime
    if (timeLeft === null) {
      bombTime = 10
    } else {
      bombTime = timeLeft
    }
    const bombRole = config.professionSpeedRole ? config.professionSpeedRole : '[Profession Speed]'
    const bombEmoji = config.professionSpeedEmoji ? config.professionSpeedEmoji : '▶️'
    const bombChannel = config.professionSpeedChannel ? config.professionSpeedChannel : config.bombChannel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
  } else if (bomb === 'Profession XP') {
    let bombTime
    if (timeLeft === null) {
      bombTime = 20
    } else {
      bombTime = timeLeft
    }
    const bombRole = config.professionXPRole ? config.professionXPRole : '[Profession XP]'
    const bombEmoji = config.professionXPEmoji ? config.professionXPEmoji : '▶️'
    const bombChannel = config.professionXPChannel ? config.professionXPChannel : config.bombChannel
    const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
    const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
    client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
      .then(msg => {
        bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
      })
  } else {
    // COMMENT: If it doesn't match: (Combat XP, Loot, Dungeon, Profession Speed, Profession XP) then log the error
    log.error(bomb)
  }
  client.guilds.cache.get(config.guildid).channels.cache.get(config.logBombChannel).send(`[${new Date(Date.now()).toLocaleTimeString('en-US')}] ${fullMessage}`)
  files.writeBombStats(world, bomb)
}

function bombCountDown (msg, message, duration, world, playerCountMax) {
  const timer = new Timer()
  let counter = 1
  timer.stop()
  timer.start({ countdown: true, startValues: { minutes: duration }, target: { minutes: 0 }, precision: 'seconds' })
  // COMMENT: target is met (0 minutes), delete message and stop timer
  timer.addEventListener('targetAchieved', () => {
    msg.delete()
      .then(log.log('Bomb Message deleted'))

    timer.removeEventListener('minutesUpdated')
    timer.removeEventListener('targetAchieved')
    counter = 1
    timer.stop()
  }) // COMMENT: otherwise edit the message with the current time left
  timer.addEventListener('secondsUpdated', async () => {
    counter = counter + 1
    if (counter <= 30) {
      return
    }
    counter = 1
    const timeLeftMinutes = timer.getTimeValues().minutes
    if (timeLeftMinutes === 0) {
      return
    }
    const playerCount = files.listOnline(world)
    msg.edit(message + ` (**${timeLeftMinutes} minutes** left) **[${playerCount}/${playerCountMax}]**`)
  })
}
module.exports = bomb
