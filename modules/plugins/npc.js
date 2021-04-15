const universal = require('../universal')
const log = require('../logging')
const wcaNPC = {}
wcaNPC.npcLook = async function npcLook (username) {
  function lookAtPlayer () {
    // COMMENT: create a filter function that checks if the entity is a player and the name of the entity is the player's username and its distance is less than 5 blocks
    const filter = entity => entity.type === 'player' && entity.username === username && entity.position.distanceTo(universal.droid.entity.position) < 5
    // COMMENT: Apply the filter and get the nearest player
    const target = universal.droid.nearestEntity(filter)
    if (!target) {
      // COMMENT: if no target, then look there
      if (universal.state.onWynncraft) universal.droid.look(Math.PI, 0)
    } else {
      const positionX = (universal.droid.entity.position.x - target.position.x)
      // const positionY = (universal.droid.entity.position.y - target.position.y) // TODO: someone help me figure out to look at the player height reee
      const positionZ = (universal.droid.entity.position.z - target.position.z)
      const lookAtPlayer = Math.atan2(positionX, positionZ)
      if (Math.abs((lookAtPlayer - universal.droid.entity.yaw)) >= Math.PI) { // COMMENT: this entire thing is supposed to make the looking more "real"
        universal.droid.look((lookAtPlayer - universal.droid.entity.yaw) / 2, 0, true)
      } else {
        universal.droid.look((lookAtPlayer + universal.droid.entity.yaw) / 2, 0, true)
      }
    }
  }
  lookAtPlayer()
}
wcaNPC.housingClick = async function housingClick (entityName, entityPositionX, entityPositionZ) {
  const filter = entity => entity.name === entityName && entity.position.x === entityPositionX && entity.position.z === entityPositionZ
  const target = universal.droid.nearestEntity(filter)
  if (target) {
    log.debug('found')
    await universal.droid.lookAt(target.position, true)
    universal.droid.attack(target)
  } else {
    log.debug('not found')
  }
}
module.exports = wcaNPC
