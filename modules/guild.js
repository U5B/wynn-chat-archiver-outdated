const config = require('./config/config.json')
const { client } = require('../index.js')
const log = require('./logging.js')
const Timer = require('easytimer.js').Timer
const guild = {}

guild.territory = async function territoryTracker (territory, time) {
  // COMMENT: track guild territory
  const duration = time
  const territoryLocation = await guild.territoryLocation(territory)
  const territoryMessage = `[${new Date(Date.now()).toLocaleTimeString('en-US')}] <@&${config.territoryRole}> War for **${territory}** (${territoryLocation})`
  client.guilds.cache.get(config.guildid).channels.cache.get(config.territoryChannel).send(territoryMessage + ` starts in **[${time}:00]**`)
    .then(msg => {
      territoryTimer(msg, territoryMessage, duration)
    })
}
async function territoryTimer (msg, territoryMessage, duration) {
  // COMMENT: guild territory timer (copy of bombCountDown())
  const durationInSeconds = duration * 60
  const timers = new Timer()
  let counter = 0
  let timeLeftMinutes = timers.getTimeValues().minutes
  let timeLeftSeconds = timers.getTimeValues().seconds
  timers.start({ countdown: true, startValues: { seconds: durationInSeconds }, target: { seconds: 0 }, precision: 'seconds' })
  timers.addEventListener('targetAchieved', async () => {
    timers.stop()
    timers.removeEventListener('minutesUpdated')
    timers.removeEventListener('targetAchieved')
    counter = 1
    msg.edit(territoryMessage + ' starts in **[NOW]**')
      .then(msg => {
        setTimeout(() => {
          msg.delete()
        }, 5000)
      })
  })
  timers.addEventListener('secondsUpdated', async () => {
    timeLeftMinutes = timers.getTimeValues().minutes
    timeLeftSeconds = timers.getTimeValues().seconds
    counter = counter + 1
    if (counter < 15) {
      return
    }
    if (timeLeftSeconds === 0) {
      timeLeftSeconds = '00'
    }
    counter = 0
    msg.edit(territoryMessage + ` starts in **[${timeLeftMinutes}:${timeLeftSeconds}]**`)
  })
}
guild.territoryLocation = async function getTerritoryLocation (territoryName) {
  const wynnTerritoryFile = require('./api/territorylocations.json')
  const ter = wynnTerritoryFile.territories
  let territoryCoordinates
  const message = territoryName
  // COMMENT: return null if territory with that name is not found
  const terIsNull = ter[`${message}`]
  if (terIsNull === undefined || terIsNull === null) {
    // COMMENT: check if the file is null
    territoryCoordinates = 'null, null'
  } else {
    // COMMENT: otherwise calculate and return the middle of the territory
    // const terName = ter[`${message}`].territory
    const terStartX = ter[`${message}`].location.startX
    const terStartY = ter[`${message}`].location.startY
    const terEndX = ter[`${message}`].location.endX
    const terEndY = ter[`${message}`].location.endY
    // COMMENT: Midpoint calculation
    const terX = Math.trunc((terStartX + terEndX) / 2)
    const terY = Math.trunc((terStartY + terEndY) / 2)
    territoryCoordinates = `${terX}, ${terY}`
  }
  return territoryCoordinates
}

guild.guildMessage = function logGuildMessageToDiscord (fullMessage, rank, username, message) {
  const guildMessagePrefix = `[${new Date(Date.now()).toLocaleTimeString('en-US')}]` + ' '
  const guildEmoji = config.guildEmoji ? config.guildEmoji : '🚩'
  let guildMessageSuffix
  if (rank === undefined) {
    guildMessageSuffix = `${guildEmoji} [**${username}**] ${message}`
  } else {
    guildMessageSuffix = `${guildEmoji} [**${rank}${username}**] ${message}`
  }
  client.guilds.cache.get(config.guildid).channels.cache.get(config.guildChatChannel).send(guildMessagePrefix + guildMessageSuffix)
}
guild.guildJoin = function logGuildJoinToDiscord (fullMessage, username, world, wynnclass) {
  const guildPrefix = `[${new Date(Date.now()).toLocaleTimeString('en-US')}]` + ' '
  const guildEmoji = config.guildEmoji ? config.guildEmoji : '🚩'
  const guildSuffix = `${guildEmoji} ▶️ **${username}**`
  client.guilds.cache.get(config.guildid).channels.cache.get(config.guildChatChannel).send(guildPrefix + guildSuffix)
}
guild.guildBank = function logGuildBankToDiscord (message, username, deposit, amount, item, fromto, rank) {
  // COMMENT: track guild bank messages
  log.log(`detected a ${deposit}`)
  const bankMessagePrefix = `[${new Date(Date.now()).toLocaleTimeString('en-US')}]` + ''
  const bankMessageSuffix = `**${amount}** ${item} by **${username}** [${rank}]`
  if (deposit === 'withdrew') {
    // COMMENT: Do this if someone took something from the guild bank
    const bankEmoji = config.bankEmojiWithdraw ? config.bankEmojiWithdraw : '⏪'
    const sentBankMessage = `${bankMessagePrefix} ${bankEmoji} ${bankMessageSuffix}`
    client.guilds.cache.get(config.guildid).channels.cache.get(config.guildBankChannel).send(sentBankMessage + '')
  }
  if (deposit === 'deposited') {
    // COMMENT: Do this if someone put something into the guild bank
    const bankEmoji = config.bankEmojiDeposit ? config.bankEmojiDeposit : '⏩'
    const sentBankMessage = `${bankMessagePrefix} ${bankEmoji} ${bankMessageSuffix}`
    client.guilds.cache.get(config.guildid).channels.cache.get(config.guildBankChannel).send(sentBankMessage + '')
  }
  // client.guilds.cache.get(config.guildid).channels.cache.get(config.logGuildBankChannel).send(now + `${message}`)
}
module.exports = guild
