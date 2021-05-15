const housing = {}
const universal = require('../universal.js')
const log = require('../logging.js')
const config = require('../config/config.js')
const simplediscord = require('../simplediscord.js')

housing.start = async function () {
  if (universal.state.housing.online || !universal.state.onlineWynn || !universal.state.onlineWorld) return
  // log.debug(universal.droid.nearestEntity())
  housing.clickSlime('slime', 452.5, -1570.5)
}
housing.restart = async function () {
  housing.leave(true)
  await universal.sleep(3000)
  housing.start()
}
housing.join = async function () {
  // You have flown to your housing island.
  simplediscord.sendTime(config.discord.log.statusChannel, ' 🏠 **Joined House.**')
  universal.state.housing.online = true
  universal.state.housing.playerList.push(universal.info.droidIGN)
  simplediscord.status()
  await universal.sleep(1000)
  universal.droid.chat('/housing public')
  await universal.sleep(500)
  if (universal.state.housing.public) universal.droid.chat('/housing public')
}
housing.leave = async function (force) {
  // You have flown to your original position.
  if (force === true) {
    housing.playerKick('uwu', true)
    await universal.sleep(500)
    universal.droid.chat('/housing leave')
  } else {
    universal.state.housing.playerList = []
    simplediscord.sendTime(config.discord.log.statusChannel, ' 🏠 **Left House.**')
    simplediscord.status()
  }
  universal.state.housing.online = false
}
let clickSlimeAgain
let slimeRetry = true
housing.clickSlime = async function (entityString, entityPositionX, entityPositionZ) {
  // COMMENT: Detlas housing: 455 68 -1570.5
  // COMMENT: Detlas housing slime: 452.5 66.5 -1570.5
  universal.droid.physics.yawSpeed = 8.0
  const filter = entity => entity.name === entityString && entity.position.x === entityPositionX && entity.position.z === entityPositionZ && entity.position.distanceTo(universal.droid.entity.position) < 6
  const target = universal.droid.nearestEntity(filter)
  log.debug(universal.droid.nearestEntity())
  if (target) {
    log.debug('found')
    housing.attack(target)
    log.debug('finished found')
  } else {
    log.error('not found')
    if (slimeRetry === true) housing.clickSlime('armor_stand', 455, -1570.5)
    slimeRetry = false
  }
}
housing.attack = async function (target) {
  await universal.droid.lookAt(target.position.offset(0, target.height / 2, 0))
  await universal.droid.attack(target)
  clickSlimeAgain = setTimeout(() => {
    universal.droid.attack(target)
  }, 3000)
}
housing.activate = async function (target) {
  await universal.droid.lookAt(target.position.offset(0, target.height / 2, 0))
  await universal.droid.activateEntity(target)
  clickSlimeAgain = setTimeout(() => {
    universal.droid.activateEntity(target)
  }, 3000)
}
// COMMENT: used in onWindowOpen
housing.clickSlot = async function () {
  clearTimeout(clickSlimeAgain)
  slimeRetry = true
  await universal.sleep(500)
  await universal.droid.clickWindow(11, 0, 0)
}
housing.playerJoin = function (player) {
  // U5B_ is visiting this island. Say hi!
  universal.state.housing.playerList.push(String(player))
  housing.ignoreBombs()
  log.debug(universal.state.housing.playerList)
}
housing.playerLeave = function (player) {
  // U5B_ left this island.
  universal.state.housing.playerList = universal.state.housing.playerList.filter(p => p !== player)
  housing.ignoreBombs()
  log.debug(universal.state.housing.playerList)
}
housing.playerInvite = function (player, all) {
  if (all === true) {
    if (universal.state.housing.public) return
    universal.droid.chat('/housing public')
  } else {
    universal.droid.chat(`/housing invite ${player}`)
  }
}
housing.playerEdit = function (player, allow) {
  if (allow === true) {
    universal.droid.chat(`/housing allowedit ${player}`)
  } else if (allow === false) {
    universal.droid.chat(`/housing disallowedit ${player}`)
  }
}
housing.playerKick = function (player, all) {
  if (all === true) {
    universal.droid.chat('/housing kickall')
  } else {
    universal.droid.chat(`/housing kick ${player}`)
  }
}
housing.playerBan = function (player, unban) {
  if (unban === true) {
    universal.droid.chat(`/housing unban ${player}`)
  } else if (unban === false) {
    universal.droid.chat(`/housing ban ${player}`)
  } else {
    log.debug(`player: ${player} | unban: ${unban}`)
  }
}
housing.housePublic = function (state) {
  if (state === 'private') {
    universal.state.housing.public = false
  } else if (state === 'public') {
    universal.state.housing.public = true
  } else {
    log.debug(state)
  }
}
housing.public = function (state) {
  if (state === true) {
    if (universal.state.housing.public === true) return
    universal.droid.chat('/housing public')
  } else if (state === false) {
    if (universal.state.housing.public === false) return
    universal.droid.chat('/housing public')
  }
}
housing.ignoreBombs = function () {
  if (universal.state.housing.playerList.length > 1) {
    config.state.ignoreBombs = true
  } else {
    config.state.ignoreBombs = false
  }
}
module.exports = housing
