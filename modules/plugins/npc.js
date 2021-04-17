const universal = require('../universal')
const wcaNPC = {}
let idleTimer
wcaNPC.npcLook = async function (username) {
  // COMMENT: create a filter function that checks if the entity is a player and the name of the entity is the player's username and its distance is less than 5 blocks
  const filter = entity => entity.type === 'player' && entity.username === username && entity.position.distanceTo(universal.droid.entity.position) < 5
  // COMMENT: Apply the filter and get the nearest player
  const target = universal.droid.nearestEntity(filter)
  if (!target) {
    // COMMENT: if no target, then look there
    idleTimer = setTimeout(() => {
      universal.droid.look(Math.PI, 0)
    }, 3000)
  } else {
    clearTimeout(idleTimer)
    /*
    const positionX = (universal.droid.entity.position.x - target.position.x)
    // const positionY = (universal.droid.entity.position.y - target.position.y) // TODO: someone help me figure out to look at the player height reee
    const positionZ = (universal.droid.entity.position.z - target.position.z)
    const lookAtPlayer = Math.atan2(positionX, positionZ)
    if (Math.abs((lookAtPlayer - universal.droid.entity.yaw)) >= Math.PI) { // COMMENT: this entire thing is supposed to make the looking more "real"
      universal.droid.look((lookAtPlayer - universal.droid.entity.yaw) / 2, 0, true)
    } else {
      universal.droid.look((lookAtPlayer + universal.droid.entity.yaw) / 2, 0, true)
    }
    */
    universal.droid.lookAt(target.position.offset(0, 1.6, 0))
  }
}
wcaNPC.clickNPC = async function (entityName, entityPositionX, entityPositionZ) {
  universal.droid.physics.yawSpeed = 12.0
  const filter = entity => entity.name === entityName && entity.position.x === entityPositionX && entity.position.z === entityPositionZ
  const target = universal.droid.nearestEntity(filter)
  if (target) {
    await universal.droid.lookAt(target.position)
    universal.droid.attack(target)
  }
}
module.exports = wcaNPC
