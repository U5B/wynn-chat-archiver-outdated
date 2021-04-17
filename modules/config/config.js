const config = require('./config.json')
// const cred = require('./cred.json')
// const universal = require('universal')

module.exports = {
  debug: {
    debug: config.debug,
    title: config.processTitle
  },
  droid: {
    master: config.masterUser,
    ip: config.ip,
    port: config.port,
    version: config.version
  },
  state: {
    bombTracker: config.bombTracker,
    guildTracker: config.guildTracker,
    shoutTracker: config.shoutTracker,
    ignoreBombs: config.ignoreBombs
  },
  msg: {
    hubMessage: config.hubMessage,
    firstConnectMessage: config.firstConnectMessage,
    worldConnectMessage: config.worldConnectMessage,
    worldReconnectMessage: config.worldReconnectMessage,
    processEndMessage: config.processEndMessage,
    kickMessage: config.kickMessage,
    startWCA: config.startWCA,
    stopWCA: config.stopWCA,
    resourcePack: config.resourcePack
  },
  discord: {
    prefix: config.prefix,
    guildid: config.guildid,
    admin: {
      masterUser: config.masterDiscordUser,
      masterRole: config.masterDiscordRole,
      trustedRole: config.trustedDiscordRole
    },
    log: {
      statusChannel: config.statusChannel,
      commandChannel: config.commandChannel,
      testChannel: config.testChannel
    },
    bomb: {
      // COMMENT: Channels
      channel: config.bombChannel,
      logBombChannel: config.logBombchannel,
      combatXPChannel: config.combatXPChannel,
      dungeonChannel: config.dungeonChannel,
      lootChannel: config.lootChannel,
      professionSpeedChannel: config.professionSpeedChannel,
      professionXPChannel: config.professionXPChannel,
      // COMMENT: Roles
      combatXPRole: config.combatXPRole,
      dungeonRole: config.dungeonRole,
      lootRole: config.lootRole,
      professionSpeedRole: config.professionSpeedRole,
      professionXPRole: config.professionXPRole,
      // COMMENT: Emoji
      combatXPEmoji: config.combatXPEmoji,
      dungeonEmoji: config.dungeonEmoji,
      lootEmoji: config.lootEmoji,
      professionSpeedEmoji: config.professionSpeedEmoji,
      professionXPEmoji: config.professionXPEmoji
    },
    guild: {
      channel: config.guildChannel,
      chatChannel: config.guildChatChannel,
      emoji: config.guildEmoji,
      bankChannel: config.guildBankChannel,
      logBankChannel: config.logGuildBankChannel,
      territoryChannel: config.territoryChannel,
      territoryRole: config.territoryRole
    },
    shout: {
      channel: config.shoutChannel
    }
  }
}
