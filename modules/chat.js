const chat = {}
const config = require('./config/config.js')
const simplediscord = require('./simplediscord.js')
const universal = require('./universal.js')
const log = require('./logging.js')

chat.logShout = function (fullMessage, username, world, shoutMessage) {
  // COMMENT: Custom Shout Message Formatting
  const sentIGN = simplediscord.noMarkdown(username)
  const sentMessage = simplediscord.noMarkdown(shoutMessage)
  const message = `[${world}] ${sentIGN}: ${sentMessage}`
  simplediscord.sendTime(config.discord.shout.channel, message)
}

chat.logChat = function (message, messageString, pos) {
  log.verbose(`${JSON.stringify(message.json)} | ${pos}`)
  // COMMENT: Champion Nickname detector - used to get the real username of the bomb thrower and guild messages
  chat.champion(message)
  const excludeSpam = /(\[Info\] .+|As the sun rises, you feel a little bit safer...|\[\+\d+ Soul Points?\]|You still have \d+ unused skill points! Click with your compass to use them!|You have \d+ unused Skill Points! Right-Click while holding your compass to use them!)/
  const exculdeDiscord = /(\[Info\] .+|As the sun rises, you feel a little bit safer...|\[\+\d+ Soul Points?\]|You still have \d+ unused skill points! Click with your compass to use them!|You have \d+ unused Skill Points! Right-Click while holding your compass to use them!)/
  if (!excludeSpam.test(messageString)) {
    if (messageString.trim() === '') return
    log.chat(`${message.toMotd()} | ${pos}`)
    const formattedString = simplediscord.noMarkdown(messageString)
    if (!exculdeDiscord.test(messageString)) chat.sendChatToDiscord(formattedString)
  }
}

let chatArray = []
let chatSendTimeout
chat.sendChatToDiscord = function (message) {
  clearTimeout(chatSendTimeout) // COMMENT: Don't send message to discord if another chat message is recieved
  chatArray.push(`[${new Date(Date.now()).toLocaleTimeString('en-US')}] ${message}`)
  chatSendTimeout = setTimeout(() => {
    chat.sendChatToDiscordNow()
  }, 1000)
  if (chatArray.length > 9) {
    // COMMENT: Force send a message to discord when the array gets too big.
    chat.sendChatToDiscordNow()
  }
}
chat.sendChatToDiscordNow = function () {
  clearTimeout(chatSendTimeout) // COMMENT: Don't send message to discord if there is already one being executed
  if (chatArray.length === 0) return // COMMENT: Don't care about empty arrays
  const condensedMessage = chatArray.join('\n')
  simplediscord.sendRaw(config.discord.log.chatChannel, condensedMessage)
  chatArray = [] // COMMENT: reset the array
}

chat.champion = function (message) {
  if (message.json.extra) {
    for (let i = 0; i < message.json.extra.length; i++) {
      // check if the nicked IGN matches
      if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[2]?.text === universal.info.droidIGN && message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
        universal.info.droidNickedIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[0]?.text
        universal.info.realIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
      } else if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
        universal.info.realIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
        // nickUsername = message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[0]?.text
      }
    }
  }
}
module.exports = chat
