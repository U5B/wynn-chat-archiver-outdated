const config = require('../config/config.js')
const universal = require('../universal')
const log = require('../logging')
const simplediscord = require('../simplediscord')
const housing = require('./housing.js')
const files = require('../files.js')
const api = require('../api.js')

const wcaCore = {}

let compassCount = 0
wcaCore.hub = function (message, force) {
  compassCount = 0
  if (universal.state.onlineWorld || force) {
    simplediscord.sendTime(config.discord.log.statusChannel, `${config.msg.hubMessage} [${message}] <@!${config.discord.admin.masterUser}>`)
    universal.droid.chat('/hub')
  }
}
wcaCore.switch = async function (message, force, world) {
  if (universal.state.onlineWorld || force) {
    api.onlinePlayers.read()
    let optimalWorld
    if (world) {
      optimalWorld = world
    } else {
      const optimalWorlds = await files.optimalWorlds()
      optimalWorld = optimalWorlds[0][0]
    }
    simplediscord.sendTime(config.discord.log.statusChannel, `${config.msg.worldReconnectMessage} [${message}] <@!${config.discord.admin.masterUser}>`)
    universal.droid.chat(`/switch ${optimalWorld}`)
    log.warn(`Switched to world: ${optimalWorld}`)
  }
}
wcaCore.compass = async function (reason) {
  if (!reason) reason = ''
  await universal.sleep(1000)
  if (universal.state.compassCheck) await universal.sleep(4000)
  // COMMENT: If already on a world, loading the resource pack or is has been kicked from the server, then do nothing
  if (universal.state.onlineWorld || !universal.state.onlineWynn || universal.state.serverSwitch) return
  log.log('Checking compass')
  universal.droid.setQuickBarSlot(0)
  // COMMENT: assume that it is slightly stuck if the held item is nothing
  if (!universal.droid.heldItem) {
    log.log(universal.droid.heldItem)
  } else {
    const itemHeld = universal.droid.heldItem.name
    log.log(itemHeld)
    // COMMENT: click on the recommended world if holding a compass
    // TODO: maybe have it select a world with low player count and/or low uptime
    // I want to minimize it taking up player slots in critical areas
    if (itemHeld === 'compass') {
      clearInterval(universal.timer.cancelCompassTimer)
      // COMMENT: retry on lobby or restart if hub is broken
      await compassActivate(reason)
      universal.timer.cancelCompassTimer = setInterval(() => {
        if (universal.state.onlineWynn && !universal.state.onlineWorld && !universal.state.serverSwitch) {
          compassActivate('lobbyRetry')
        }
      }, 10000)
    }
  }
}
async function compassActivate (reason) {
  compassCount++
  if (compassCount > 3) wcaCore.hub('lobbyAttempts3', true)
  log.log('Clicking compass...')
  simplediscord.sendTime(config.discord.log.statusChannel, `${config.msg.worldReconnectMessage} [Lobby] [${reason}]`)
  universal.droid.activateItem()
}
wcaCore.onWindowOpen = async function (window) {
  window.requiresConfirmation = false
  // COMMENT: this is used so that I can technically support any gui in one section of my code
  const windowText = JSON.parse(window.title).text
  if (windowText === 'Wynncraft Servers') {
    compassCount = 0
    // COMMENT: Hardcoded to click on the recommended server slot - might need to be changed if Wynncraft updates their gui
    await universal.sleep(1000)
    await universal.droid.clickWindow(13, 0, 0)
    universal.state.compassCheck = true
    log.log('Clicked recommended slot.')
  } else if (windowText === 'Go to house') {
    housing.clickSlot()
  } else if (windowText === '§8§lSelect a Class') {
    log.error(`somehow in class menu "${windowText}" going to hub - use /toggle autojoin`)
    log.debug(window.slots)
    await universal.sleep(1000)
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
wcaCore.onWorldJoin = async function (username, world, wynnclass) {
  // COMMENT: Your now on a world - you have stopped loading resource pack lol
  universal.state.onlineWorld = true
  universal.state.serverSwitch = false
  // COMMENT: Set the currentWorld to the current World instead of WC0
  universal.info.currentWorld = world
  log.log(`Online on ${world}`)
  simplediscord.sendTime(config.discord.log.statusChannel, `${config.msg.worldConnectMessage}`)
  simplediscord.status() // COMMENT: check discord status
  if (config.state.housingTracker && config.state.autoJoinHousing) {
    await universal.sleep(1500)
    housing.start()
  }
}
wcaCore.lobbyError = function (reason) {
  if (reason == null) reason = ' '
  if (universal.state.onlineWorld || universal.state.serverSwitch) {
    wcaCore.hub(reason, true)
  } else {
    wcaCore.compass(reason)
  }
}
module.exports = wcaCore
