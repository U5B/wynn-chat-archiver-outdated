const config = require('./config/config.json')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const files = {}

files.listOnline = function listOnlinePlayers (world) {
  // COMMENT: read onlinePlayers.json and return the playercount of the argument / world
  const parsed = require('./api/onlinePlayers.json')
  let playerCountFromFile
  if (!parsed.servers[`${world}`]) {
    playerCountFromFile = '-1'
  } else {
    playerCountFromFile = Object.keys(parsed.servers[`${world}`].players).length
  }
  return playerCountFromFile
}
files.getRandomPlayer = function getRandomPlayer (world) {
  // COMMENT: read onlinePlayers.json and pick a random player
  const parsed = require('./api/onlinePlayers.json')
  let randomPlayer
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
files.getBombStats = function getBombStats (world, stats) {
  // QUOTE: "this could be done so much better" - U9G
  // COMMENT: read onlinePlayers.json and pick a random player
  const parsed = require('./api/WCStats.json')
  const combatXPEmoji = config.combatXPEmoji ? config.combatXPEmoji : '💣'
  const lootEmoji = config.lootEmoji ? config.lootEmoji : '💣'
  const dungeonEmoji = config.dungeonEmoji ? config.dungeonEmoji : '💣'
  const professionSpeedEmoji = config.professionSpeedEmoji ? config.professionSpeedEmoji : '💣'
  const professionXPEmoji = config.professionXPEmoji ? config.professionXPEmoji : '💣'
  let worldStats
  if (!parsed[`${world}`]) {
    worldStats = null
  } else if (stats) {
    if (stats === 'Combat_XP') {
      stats = 'Combat XP'
      const bombSuffix = `**[${stats} Bomb]:** ${parsed[`${world}`][`${stats}`]}`
      worldStats = `${combatXPEmoji} ${bombSuffix}`
    } else if (stats === 'Loot') {
      stats = 'Loot'
      const bombSuffix = `**[${stats} Bomb]:** ${parsed[`${world}`][`${stats}`]}`
      worldStats = `${combatXPEmoji} ${bombSuffix}`
    } else if (stats === 'Dungeon') {
      stats = 'Dungeon'
      const bombSuffix = `**[${stats} Bomb]:** ${parsed[`${world}`][`${stats}`]}`
      worldStats = `${combatXPEmoji} ${bombSuffix}`
    } else if (stats === 'Profession_Speed') {
      stats = 'Profession Speed'
      const bombSuffix = `**[${stats} Bomb]:** ${parsed[`${world}`][`${stats}`]}`
      worldStats = `${combatXPEmoji} ${bombSuffix}`
    } else if (stats === 'Profession_XP') {
      stats = 'Profession XP'
      const bombSuffix = `**[${stats} Bomb]:** ${parsed[`${world}`][`${stats}`]}`
      worldStats = `${combatXPEmoji} ${bombSuffix}`
    } else {
      worldStats = null
    }
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
module.exports = files
