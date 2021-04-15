const config = require('../config/config')
const universal = require('../universal')
const log = require('../logging')
const simplediscord = require('../simplediscord')
const { sleep } = require('../../index')

const wcaCore = {}
wcaCore.hub = function hub (message, force) {
  if (universal.state.onAWorld || force) {
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.hubRestartMessage} [${message}] <@!${config.masterDiscordUser}>`)
    simplediscord.sendTime(config.statusChannel, `${config.hubRestartMessage} [${message}] <@!${config.masterDiscordUser}>`)
    universal.droid.chat('/hub')
  }
}
wcaCore.compass = async function compass (reason) {
  if (!reason) reason = ''
  if (universal.state.compassCheck) {
    await sleep(4000)
  } else {
    await sleep(1000)
  }
  // COMMENT: If already on a world, loading the resource pack or is has been kicked from the server, then do nothing
  if (universal.state.onAWorld || !universal.state.onWynncraft || universal.state.resourcePackLoading) return
  log.log('Checking compass')
  universal.droid.setQuickBarSlot(0)
  // COMMENT: assume that bot is slightly stuck if the held item is nothing
  if (!universal.droid.heldItem) {
    log.log(universal.droid.heldItem)
  } else {
    const itemHeld = universal.droid.heldItem.name
    log.log(itemHeld)
    // COMMENT: click on the recommended world if holding a compass
    // TODO: maybe have it select a world with low player count and/or low uptime
    // I want to minimize it taking up player slots in critical areas
    clearInterval(universal.timer.cancelCompassTimer)
    async function compassActivate () {
      log.log('Clicking compass...')
      // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.worldReconnectMessage} [Lobby]`)
      simplediscord.sendTime(config.statusChannel, `${config.worldReconnectMessage} [Lobby] [${reason}]`)
      universal.droid.activateItem()
    }
    if (itemHeld === 'compass') {
      // COMMENT: retry on lobby or restart entire bot if hub is broken
      await compassActivate()
      universal.timer.cancelCompassTimer = setInterval(() => {
        if (universal.state.onWynncraft && !universal.state.onAWorld && !universal.state.resourcePackLoading) {
          compassActivate()
        }
      }, 10000)
    }
  }
  // if (itemHeld === 'bow' || itemHeld === 'wooden_shovel' || itemHeld === 'iron_shovel' || itemHeld === 'stone_shovel' || itemHeld === 'shears') {
  //  bot.setQuickBarSlot(7)
  // }
}
wcaCore.onWindowOpen = async function onWindowOpen (window) {
  window.requiresConfirmation = false
  // COMMENT: this is used so that I can technically support any gui in one section of my code
  const windowText = JSON.parse(window.title).text
  if (windowText === 'Wynncraft Servers') {
    // COMMENT: Hardcoded to click on the recommended server slot - might need to be changed if Wynncraft updates their gui
    await sleep(500)
    await universal.droid.clickWindow(13, 0, 0)
    universal.state.compassCheck = true
    log.log('Clicked recommended slot.')
  } else if (windowText === 'Go to house') {
    await sleep(500)
    await universal.droid.clickWindow(11, 0, 0)
  } else if (windowText === '§8§lSelect a Class') {
    log.error(`somehow in class menu "${windowText}" going to hub - use /toggle autojoin`)
    log.debug(window.slots)
    await sleep(500)
    universal.droid.closeWindow(window)
    wcaCore.hub('Class Menu', true)
  } else {
    // COMMENT: debugging purposes, this shouldn't happen unless stuck in the class menu
    log.error(`opened unknown gui with title "${windowText}"`)
    log.debug(window.slots)
    log.debug(windowText)
    universal.droid.closeWindow(window)
  }
}
wcaCore.chatLog = async function chatLog (message, messageString, excludeSpam) {
  const jsonString = JSON.stringify(message.json)
  log.verbose(jsonString)
  // COMMENT: Champion Nickname detector - used to get the real username of the bomb thrower and guild messages
  if (message.json.extra) {
    for (let i = 0; i < message.json.extra.length; i++) {
      // check if the nicked username is the bot
      if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[2]?.text === universal.info.droidIGN && message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
        universal.info.droidNickedIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[0]?.text
        universal.info.realIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
      } else if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
        universal.info.realIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
        // nickUsername = message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[0]?.text
      }
    }
  }
  if (!excludeSpam.test(messageString)) log.chat(message.toMotd())
}
wcaCore.onBotJoin = async function onBotJoin (username, world, wynnclass) {
  // COMMENT: Your now on a world - you have stopped loading resource pack lol
  universal.state.onAWorld = true
  universal.state.resourcePackLoading = false
  // COMMENT: Set the currentWorld to the current World instead of WC0
  universal.info.currentWorld = world
  log.log(`Online on ${world}`)
  // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.worldConnectMessage}`)
  simplediscord.sendTime(config.statusChannel, `${config.worldConnectMessage}`)
  simplediscord.status() // COMMENT: check discord status
}
wcaCore.lobbyError = async function lobbyError (reason) {
  if (reason == null) reason = ' '
  if (universal.state.onAWorld) {
    wcaCore.hub(reason, true)
  } else {
    wcaCore.compass(reason)
  }
}
module.exports = wcaCore
