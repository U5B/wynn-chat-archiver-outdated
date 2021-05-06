const config = require('./config/config.js')
const universal = require('./universal.js')
const api = require('./api.js')
const log = require('./logging')
// const fs = require('fs')
// const path = require('path')
const files = {}
files.optimalWorlds = async function () {
  let optimalWorld = Object.entries(universal.api.onlinePlayers)
    .sort(([worldA, a], [worldB, b]) => b.firstSeen - a.firstSeen)
    .filter(a => (a[1].players).length > 1)
    .filter(a => (a[1].players).length <= 36)
    .filter(a => (universal.api.bombArray.indexOf(a[0]) === -1))
  const lowestWorldTime = optimalWorld[0][1].firstSeen
  optimalWorld = optimalWorld
    .filter(data => Date.now() - data[1].firstSeen <= (Date.now() - lowestWorldTime) + 3600000)
    .sort(([worldA, a], [worldB, b]) => (a.players).length - (b.players).length)
  return optimalWorld
}
files.listOnline = async function (world) {
  // COMMENT: read onlinePlayers.json and return the playercount of the argument / world
  let playerCountResponse = -1
  const parsed = universal.api.onlinePlayers
  if (parsed[`${world}`]) {
    playerCountResponse = Object.keys(parsed[`${world}`].players).length
  }
  return playerCountResponse
}
files.getRandomPlayer = function (world) {
  // COMMENT: read onlinePlayers.json and pick a random player
  let randomPlayer = 'null'
  const parsed = universal.api.onlinePlayers
  if (!parsed[`${world}`]) {
    randomPlayer = 'null'
  } else {
    const start = 0
    const end = (parsed[`${world}`].players).length
    const randomNumber = Math.floor((Math.random() * end) + start)
    randomPlayer = parsed[`${world}`].players[randomNumber]
  }
  return randomPlayer
}
function sanitize (args) {
  return {
    Combat_XP: 'Combat XP',
    Loot: 'Loot',
    Dungeon: 'Dungeon',
    Profession_Speed: 'Profession Speed',
    Profession_XP: 'Profession XP',
    'Combat XP': 'Combat XP',
    'Profession Speed': 'Profession Speed',
    'Profession XP': 'Profession XP'
  }[args] ?? null
}
files.getBombStats = function (world, statsInput) {
  // QUOTE: "this could be done so much better" - U9G
  // COMMENT: read WCStats and get some bomb stats
  const parsed = universal.api.WCStats
  const combatXPEmoji = config.discord.bomb.combatXPEmoji ? config.discord.bomb.combatXPEmoji : '💣'
  const lootEmoji = config.discord.bomb.lootEmoji ? config.discord.bomb.lootEmoji : '💣'
  const dungeonEmoji = config.discord.bomb.dungeonEmoji ? config.discord.bomb.dungeonEmoji : '💣'
  const professionSpeedEmoji = config.discord.bomb.professionSpeedEmoji ? config.discord.bomb.professionSpeedEmoji : '💣'
  const professionXPEmoji = config.discord.bomb.professionXPEmoji ? config.discord.bomb.professionXPEmoji : '💣'
  let worldStats
  if (!parsed[`${world}`]) {
    worldStats = null
  } else if (statsInput) {
    const stats = sanitize(statsInput)
    if (stats == null) return
    const bombSuffix = `**[${stats} Bomb]:** ${parsed[`${world}`][`${stats}`]}`
    worldStats = `${combatXPEmoji} ${bombSuffix}`
  } else {
    const combatXP = `${combatXPEmoji} **[Combat XP Bomb]:** ${parsed[`${world}`]['Combat XP']}`
    const loot = `${lootEmoji} **[Loot Bomb]:** ${parsed[`${world}`].Loot}`
    const dungeon = `${dungeonEmoji} **[Dungeon Bomb]:** ${parsed[`${world}`].Dungeon}`
    const professionSpeed = `${professionSpeedEmoji} **[Profession Speed Bomb]:** ${parsed[`${world}`]['Profession Speed']}`
    const professionXP = `${professionXPEmoji} **[Profession XP Bomb:]** ${parsed[`${world}`]['Profession XP']}`
    worldStats = combatXP + '\n' + loot + '\n' + dungeon + '\n' + professionSpeed + '\n' + professionXP
  }
  return worldStats
}
files.getBombLeaderboard = function (input) {
  const parsed = universal.api.WCStats
  const stats = sanitize(input)
  if (stats == null) return null
  return Object.entries(parsed)
    .sort(([worldA, a], [worldB, b]) => b[stats] - a[stats])
    .map((elem, ix) => `${ix + 1}. [${elem[0]}] ${elem[1][stats]}`)
    .slice(0, 10)
    .join('\n')
}
files.writeBombStats = function (world, bomb) {
  // QUOTE: "this could be done so much better" - U9G
  // COMMENT: Add +1 to a specific bomb on a world
  if (!universal.api.WCStats[world]) return
  log.log(`${world}: ${bomb}`)
  universal.api.WCStats[world][bomb]++
  api.WCStats.write()
}
module.exports = files
