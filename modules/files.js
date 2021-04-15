const config = require('./config/config.json')
const universal = require('./universal.js')
const api = require('./api.js')
const log = require('./logging')
// const fs = require('fs')
// const path = require('path')
const files = {}

files.listOnline = function listOnlinePlayers (world) {
  // COMMENT: read onlinePlayers.json and return the playercount of the argument / world
  let playerCountResponse = -1
  const parsed = universal.api.onlinePlayers // JSON.parse(fs.readFileSync(path.join(__dirname, '/api/onlinePlayers.json'), 'utf-8'))
  if (parsed.servers[`${world}`]) {
    playerCountResponse = Object.keys(parsed.servers[`${world}`].players).length
  }
  return playerCountResponse
}
files.getRandomPlayer = function getRandomPlayer (world) {
  // COMMENT: read onlinePlayers.json and pick a random player
  let randomPlayer = 'null'
  const parsed = universal.api.onlinePlayers // JSON.parse(fs.readFileSync(path.join(__dirname, '/api/onlinePlayers.json'), 'utf-8'))
  if (!parsed.servers[`${world}`]) {
    randomPlayer = 'null'
  } else {
    const start = 0
    const end = (parsed.servers[`${world}`].players).length
    const randomNumber = Math.floor((Math.random() * end) + start)
    randomPlayer = parsed.servers[`${world}`].players[randomNumber]
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
files.getBombStats = function getBombStats (world, statsInput) {
  // QUOTE: "this could be done so much better" - U9G
  // COMMENT: read WCStats and get some bomb stats
  const parsed = universal.api.WCStats
  const combatXPEmoji = config.combatXPEmoji ? config.combatXPEmoji : '💣'
  const lootEmoji = config.lootEmoji ? config.lootEmoji : '💣'
  const dungeonEmoji = config.dungeonEmoji ? config.dungeonEmoji : '💣'
  const professionSpeedEmoji = config.professionSpeedEmoji ? config.professionSpeedEmoji : '💣'
  const professionXPEmoji = config.professionXPEmoji ? config.professionXPEmoji : '💣'
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
files.getBombLeaderboard = function getBombLeaderboard (input) {
  const parsed = universal.api.WCStats
  const stats = sanitize(input)
  if (stats == null) return null
  return Object.entries(parsed)
    .sort(([worldA, a], [worldB, b]) => b[stats] - a[stats])
    .map((elem, ix) => `${ix + 1}. [${elem[0]}] ${elem[1][stats]}`)
    .slice(0, 10)
    .join('\n')
}
files.writeBombStats = function writeBombStats (world, bomb) {
  // QUOTE: "this could be done so much better" - U9G
  // COMMENT: Add +1 to a specific bomb on a world
  log.log(`${world}: ${bomb}`)
  universal.api.WCStats[world][bomb]++
  api.WCStats.write()
}
module.exports = files
