const config = require('../config/config')
const universal = require('../univariables')
const log = require('../logging')
const simplediscord = require('../simplediscord')
const { sleep } = require('../../index')

const wcacore = {}
wcacore.hub = function hub (message) {
  if (universal.onAWorld === true && universal.resourcePackLoading === false) {
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.hubRestartMessage} [${message}] <@!${config.masterDiscordUser}>`)
    simplediscord.sendTime(config.statusChannel, `${config.hubRestartMessage} [${message}] <@!${config.masterDiscordUser}>`)
    universal.bot.chat('/hub')
  }
}
wcacore.compass = async function compass () {
  if (universal.compassCheck) {
    await sleep(4000)
  } else {
    await sleep(1000)
  }
  // COMMENT: If already on a world, loading the resource pack or is has been kicked from the server, then do nothing
  if (universal.onAWorld || !universal.onWynncraft || universal.resourcePackLoading) return
  log.log('Checking compass')
  universal.bot.setQuickBarSlot(0)
  // COMMENT: assume that bot is slightly stuck if the held item is nothing
  if (!universal.bot.heldItem) {
    log.log(universal.bot.heldItem)
  } else {
    const itemHeld = universal.bot.heldItem.name
    log.log(itemHeld)
    // COMMENT: click on the recommended world if holding a compass
    // TODO: maybe have it select a world with low player count and/or low uptime
    // I want to minimize it taking up player slots in critical areas
    clearInterval(universal.cancelCompassTimer)
    async function compassActivate () {
      log.log('Clicking compass...')
      // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.worldReconnectMessage} [Lobby]`)
      simplediscord.sendTime(config.statusChannel, `${config.worldReconnectMessage} [Lobby]`)
      universal.bot.activateItem()
    }
    if (itemHeld === 'compass') {
      // COMMENT: retry on lobby or restart entire bot if hub is broken
      await compassActivate()
      universal.cancelCompassTimer = setInterval(() => {
        if (universal.onWynncraft === true && universal.onAWorld === false && universal.resourcePackLoading === false) {
          compassActivate()
        }
      }, 10000)
    }
  }
  // if (itemHeld === 'bow' || itemHeld === 'wooden_shovel' || itemHeld === 'iron_shovel' || itemHeld === 'stone_shovel' || itemHeld === 'shears') {
  //  bot.setQuickBarSlot(7)
  // }
}
wcacore.onWindowOpen = async function onWindowOpen (window) {
  window.requiresConfirmation = false
  // COMMENT: this is used so that I can technically support any gui in one section of my code
  const windowText = JSON.parse(window.title).text
  if (windowText === 'Wynncraft Servers') {
    // COMMENT: Hardcoded to click on the recommended server slot - might need to be changed if Wynncraft updates their gui
    await sleep(500)
    await universal.bot.clickWindow(13, 0, 0)
    universal.compassCheck = true
    log.log('Clicked recommended slot.')
  } else if (windowText === 'Go to house') {
    await sleep(500)
    await universal.bot.clickWindow(11, 0, 0)
  } else if (windowText === '§8§lSelect a Class') {
    log.error(`somehow in class menu "${windowText}" going to hub - use /toggle autojoin`)
    log.debug(window.slots)
    await sleep(500)
    universal.bot.closeWindow(window)
    wcacore.hub('Class Menu')
  } else {
    // COMMENT: debugging purposes, this shouldn't happen unless stuck in the class menu
    log.error(`opened unknown gui with title "${windowText}"`)
    log.debug(window.slots)
    log.debug(windowText)
    universal.bot.closeWindow(window)
  }
}
wcacore.chatLog = async function chatLog (message, messageString, excludeSpam) {
  const jsonString = JSON.stringify(message.json)
  log.verbose(jsonString)
  // COMMENT: Champion Nickname detector - used to get the real username of the bomb thrower and guild messages
  if (message.json.extra) {
    for (let i = 0; i < message.json.extra.length; i++) {
      // check if the nicked username is the bot
      if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[2]?.text === universal.botUsername && message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
        universal.botNickedUsername = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[0]?.text
        universal.realUsername = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[0]?.text
      } else if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
        universal.realUsername = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
        // nickUsername = message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[0]?.text
      }
    }
  }
  if (!excludeSpam.test(messageString)) log.chat(message.toMotd())
}
wcacore.onBotJoin = async function onBotJoin (username, world, wynnclass) {
  // COMMENT: Your now on a world - you have stopped loading resource pack lol
  universal.onAWorld = true
  universal.resourcePackLoading = false
  // COMMENT: Set the currentWorld to the current World instead of WC0
  universal.currentWorld = world
  log.log(`Online on ${world}`)
  // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.worldConnectMessage}`)
  simplediscord.sendTime(config.statusChannel, `${config.worldConnectMessage}`)
  simplediscord.status() // COMMENT: check discord status
}
wcacore.lobbyError = async function lobbyError (reason) {
  if (reason == null) reason = ' '
  if (universal.onAWorld) {
    wcacore.hub(reason)
  } else {
    wcacore.compass()
  }
}
module.exports = wcacore
