const housing = {}
let playerArray = []
const universal = require('../universal.js')
const log = require('../logging.js')
const config = require('../config/config.js')
const simplediscord = require('../simplediscord.js')

housing.start = async function () {
  if (universal.state.onHousing || !universal.state.onWynncraft || !universal.state.onWorld) return
  await universal.sleep(1500)
  log.debug(universal.droid.nearestEntity())
  housing.clickSlime(455, -1570.5)
}
housing.join = async function () {
  // You have flown to your housing island.
  simplediscord.sendTime(config.discord.log.statusChannel, ' 🏠 Joined housing.')
  universal.state.onHousing = true
  playerArray.push(universal.info.droidIGN)
  simplediscord.status()
  await universal.sleep(1000)
  universal.droid.chat('/housing public')
  await universal.sleep(500)
  if (universal.housingPublic) universal.droid.chat('/housing public')
  housing.playerInvite(config.droid.master)
}
housing.leave = async function (force) {
  // You have flown to your original position.
  if (force === true) {
    housing.playerKick('uwu', true)
    await universal.sleep(500)
    universal.droid.chat('/housing leave')
  } else {
    playerArray = playerArray.filter(p => p !== universal.info.droidIGN)
    simplediscord.sendTime(config.discord.log.statusChannel, ' 🏠 Left housing.')
    simplediscord.status()
  }
  universal.state.onHousing = false
}
housing.clickSlime = async function (entityPositionX, entityPositionZ) {
  // COMMENT: Detlas housing: x: 455, y: 67.5, z:-1570.5
  universal.droid.physics.yawSpeed = 12.0
  const filter = entity => entity.name === 'slime' && entity.position.x === entityPositionX && entity.position.z === entityPositionZ && entity.position.distanceTo(universal.droid.entity.position) < 6
  const target = universal.droid.nearestEntity(filter)
  log.debug(universal.droid.nearestEntity())
  if (target) {
    log.debug('found')
    await universal.droid.lookAt(target.position.offset(0, target.height / 2, 0))
    if (!universal.droid.blockAtCursor(3)) {
      universal.droid.attack(target)
    } else {
      log.error('Obstruction found')
      universal.droid.look(Math.PI, 0)
    }
  } else {
    log.error('not found')
  }
}
// COMMENT: used in onWindowOpen
housing.clickSlot = async function () {
  await universal.sleep(500)
  await universal.droid.clickWindow(11, 0, 0)
}
housing.playerJoin = function (player) {
  // U5B_ is visiting this island. Say hi!
  playerArray.push(String(player))
  housing.ignoreBombs()
  log.debug(playerArray)
}
housing.playerLeave = function (player) {
  // U5B_ left this island.
  playerArray = playerArray.filter(p => p !== player)
  housing.ignoreBombs()
  log.debug(playerArray)
}
housing.playerInvite = function (player, all) {
  if (all === true) {
    universal.droid.chat('/housing public')
  } else {
    universal.droid.chat(`/housing invite ${player}`)
  }
}
housing.playerEdit = function (player, allow) {
  if (allow === true) {
    universal.droid.chat(`/housing allowedit ${player}`)
  } else {
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
  } else {
    universal.droid.chat(`/housing ban ${player}`)
  }
}
housing.housePublic = function (state) {
  if (state === 'private') {
    universal.state.housingPublic = false
  } else {
    universal.state.housingPublic = true
  }
}
housing.public = function (state) {
  if (state === true) {
    if (universal.state.housingPublic === true) return
    universal.droid.chat('/housing public')
  } else {
    if (universal.state.housingPublic === false) return
    universal.droid.chat('/housing public')
  }
}
housing.ignoreBombs = function () {
  if (playerArray.length > 1) {
    config.state.ignoreBombs = true
  } else {
    config.state.ignoreBombs = false
  }
  log.debug(config.state.ignoreBombs)
}
module.exports = housing
