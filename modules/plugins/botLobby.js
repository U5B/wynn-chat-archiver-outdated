const config = require('../config/config')
const universal = require('../univariables')
const log = require('../logging')
const simplediscord = require('../simplediscord')
const { sleep } = require('../../index')

const botlobby = {}
botlobby.hub = function hub (message) {
  if (universal.onAWorld === true && universal.resourcePackLoading === false) {
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.hubRestartMessage} [${message}] <@!${config.masterDiscordUser}>`)
    simplediscord.sendTime(config.statusChannel, `${config.hubRestartMessage} [${message}] <@!${config.masterDiscordUser}>`)
    universal.bot.chat('/hub')
  }
}
botlobby.compass = async function compass () {
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
botlobby.onWindowOpen = async function onWindowOpen (window) {
  window.requiresConfirmation = false
  // COMMENT: this is used so that I can technically support any gui in one section of my code
  const windowText = JSON.parse(window.title).text
  if (windowText === 'Wynncraft Servers') {
    // COMMENT: Hardcoded to click on the recommended server slot - might need to be changed if Wynncraft updates their gui
    await sleep(500)
    await universal.bot.clickWindow(13, 0, 0)
    universal.compassCheck = true
    log.log('Clicked recommended slot.')
  } else if (windowText === '§8§lSelect a Class') {
    log.error(`somehow in class menu "${windowText}" going to hub - use /toggle autojoin`)
    universal.bot.closeWindow(window)
    botlobby.hub('Class Menu')
  } else {
    // COMMENT: debugging purposes, this shouldn't happen unless stuck in the class menu
    log.error(`opened unknown gui with title "${windowText}"`)
    universal.bot.closeWindow(window)
  }
}
module.exports = botlobby
