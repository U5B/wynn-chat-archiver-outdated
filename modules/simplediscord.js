const config = require('./config/config.json')
const { client } = require('../index.js')
const universal = require('./univariables.js')
const log = require('./logging.js')

const discordexport = {}
discordexport.sendTime = function sendDiscordTime (channel, message) {
  client.guilds.cache.get(config.guildid).channels.cache.get(channel).send(`[${new Date(Date.now()).toLocaleTimeString('en-US')}] ${message}`)
}
discordexport.sendDate = function sendDiscordDate (channel, message) {
  client.guilds.cache.get(config.guildid).channels.cache.get(channel).send(`[${new Date(Date.now()).toLocaleString('en-US')}] ${message}`)
}
discordexport.status = function discordStatus (status) {
  const onWynncraft = universal.onWynncraft.get()
  const onAWorld = universal.onAWorld.get()
  const resourcePackLoading = universal.resourcePackLoading.get()
  const setPresence = (stat, active) => {
    client.user.setPresence({
      status: stat,
      activity: {
        name: active
      }
    })
  }
  if (status === 'starting') {
    setPresence('dnd', 'connecting to wynncraft')
  } else {
    if (onWynncraft && onAWorld && !resourcePackLoading) {
      setPresence('online', 'archiving chat - play.wynncraft.com')
    } else if (onWynncraft && !onAWorld && !resourcePackLoading) {
      setPresence('idle', 'in a lobby - play.wynncraft.com')
    } else if (onWynncraft && !onAWorld && resourcePackLoading) {
      setPresence('idle', 'in class menu - play.wynncraft.com')
    } else if (!onWynncraft && !onAWorld && !resourcePackLoading) {
      setPresence('dnd', `offline | type ${config.prefix}start to restart`)
    } else {
      log.error(`Error when setting status: "onWynncraft": ${onWynncraft} | "onAWorld": ${onAWorld} | "resourcePackLoading": ${resourcePackLoading} `)
    }
  }
}

module.exports = discordexport
