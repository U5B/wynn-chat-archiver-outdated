// const config = require('./config.json')
// const cred = require('./cred.json')
const universal = require('../universal')
// const defaults = require('../mongodb/mongodefaults')
const droid = universal.mongodb.config.droid.default
const discord = universal.mongodb.config.discord.default
module.exports = {
  droid: {
    master: droid.master.ign,
    ip: droid.ip,
    version: droid.version
  },
  state: {
    bombTracker: droid.trackers.bomb.state,
    guildTracker: droid.trackers.guild.state,
    shoutTracker: droid.trackers.shout.state,
    ignoreBombs: droid.trackers.bomb.ignore,
    housingTracker: droid.trackers.housing.state,
    autoJoinHousing: droid.trackers.housing.autoJoin
  },
  msg: {
    hubMessage: discord.msg.hub,
    firstConnectMessage: discord.msg.firstConnect,
    worldConnectMessage: discord.msg.worldConnect,
    worldReconnectMessage: discord.msg.worldReconnect,
    processEndMessage: discord.msg.processEnd,
    kickMessage: discord.msg.kick,
    startWCA: discord.msg.start,
    stopWCA: discord.msg.stop,
    resourcePack: discord.msg.resourcePack
  },
  discord: {
    prefix: discord.prefix,
    guildid: discord.guildID,
    admin: {
      masterUser: discord.roles.master.user,
      masterRole: discord.roles.master.role,
      trustedRole: discord.roles.trusted.role
    },
    log: {
      chatChannel: discord.channels.chat.chat,
      statusChannel: discord.channels.log.status,
      commandChannel: discord.channels.log.command,
      testChannel: discord.channels.test
    },
    bomb: {
      // COMMENT: Channels
      channel: discord.channels.bomb.channel,
      logBombChannel: discord.channels.log.bomb,
      combatXPChannel: discord.channels.bomb.Combat_XP,
      dungeonChannel: discord.channels.bomb.Dungeon,
      lootChannel: discord.channels.bomb.Loot,
      professionSpeedChannel: discord.channels.bomb.Profession_Speed,
      professionXPChannel: discord.channels.bomb.Profession_XP,
      // COMMENT: Roles
      combatXPRole: discord.roles.bomb.Combat_XP,
      dungeonRole: discord.roles.bomb.Dungeon,
      lootRole: discord.roles.bomb.Loot,
      professionSpeedRole: discord.roles.bomb.Profession_Speed,
      professionXPRole: discord.roles.bomb.Profession_XP,
      // COMMENT: Emoji
      combatXPEmoji: discord.emoji.bomb.Combat_XP,
      dungeonEmoji: discord.emoji.bomb.Dungeon,
      lootEmoji: discord.emoji.bomb.Loot,
      professionSpeedEmoji: discord.emoji.bomb.Profession_Speed,
      professionXPEmoji: discord.emoji.bomb.Profession_XP
    },
    guild: {
      channel: discord.channels.guild.channel,
      chatChannel: discord.channels.guild.chat,
      emoji: discord.emoji.guild,
      bankChannel: discord.channels.guild.bank,
      logBankChannel: discord.channels.log.bank,
      territoryChannel: discord.channels.guild.territory,
      territoryRole: discord.channels.log.territory
    },
    shout: {
      channel: discord.channels.chat.shout
    }
  }
}
