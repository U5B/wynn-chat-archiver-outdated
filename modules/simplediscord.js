const config = require('./config/config.js')
const { client } = require('../index.js')
const universal = require('./universal.js')
const log = require('./logging.js')

const simplediscord = {}
simplediscord.sendTime = function sendTime (channel, message) {
  client.guilds.cache.get(config.discord.guildid).channels.cache.get(channel).send(`[${new Date(Date.now()).toLocaleTimeString('en-US')}] ${message}`)
}
simplediscord.sendDate = function sendDate (channel, message) {
  client.guilds.cache.get(config.discord.guildid).channels.cache.get(channel).send(`[${new Date(Date.now()).toLocaleString('en-US')}] ${message}`)
}
simplediscord.status = function status (status, state, message) {
  const onWynncraft = universal.state.onlineWynn
  const onAWorld = universal.state.onlineWorld
  const serverSwitch = universal.state.serverSwitch
  const onAHouse = universal.state.housing.online
  const setPresence = (stat, active, emote) => {
    client.user.setPresence({
      status: stat,
      activity: {
        name: active,
        emoji: emote
      }
    })
  }
  if (status === 'starting') {
    setPresence('dnd', 'connecting to wynncraft')
  } else if (status === 'set') {
    setPresence(state, message)
  } else {
    if (onWynncraft && onAWorld && !serverSwitch && !onAHouse) {
      setPresence('online', 'archiving chat - play.wynncraft.com')
    } else if (onWynncraft && onAWorld && !serverSwitch && onAHouse) {
      setPresence('online', 'hosting house - play.wynncraft.com', '🏠')
    } else if (onWynncraft && !onAWorld && !serverSwitch) {
      setPresence('idle', 'in a lobby - play.wynncraft.com')
    } else if (onWynncraft && !onAWorld && serverSwitch) {
      setPresence('idle', 'in class menu - play.wynncraft.com')
    } else if (!onWynncraft && !onAWorld && !serverSwitch) {
      setPresence('dnd', `offline | type ${config.discord.prefix}start to restart`)
    } else {
      log.error(`Error when setting status: "onWynncraft": ${onWynncraft} | "onAWorld": ${onAWorld} | "serverSwitch": ${serverSwitch} `)
    }
  }
}

module.exports = simplediscord
