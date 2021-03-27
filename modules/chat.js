const config = require('./config/config.json')
const { client } = require('../index.js')
const chat = {}

chat.logShout = function logShoutToDiscord (fullMessage, username, world, shoutMessage) {
  // COMMENT: Custom Shout Message Formatting
  client.guilds.cache.get(config.guildid).channels.cache.get(config.shoutChannel).send(`[${new Date(Date.now()).toLocaleTimeString('en-US')}]` + ` [${world}] \`${username}\`: \`${shoutMessage}\``)
}
module.exports = chat
