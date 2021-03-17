// SECTION: Mineflayer modules
const mineflayer = require('mineflayer')
// const mineflayerViewer = require('prismarine-viewer').mineflayer
const tpsPlugin = require('mineflayer-tps')(mineflayer)

// SECTION: Discord modules
const discord = require('discord.js')
const client = new discord.Client({ disableMentions: 'everyone' })

// SECTION: File system and other logging
const process = require('process')
const util = require('util')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

// SECTION: Timers
const Timer = require('easytimer.js').Timer
const { setInterval, setTimeout } = require('timers')

// SECTION: all of the configs I need and wynncraft api
const config = require('./config.json')
const cred = require('./cred.json')
const wynnTerritoryFile = require('./territorylocations.json')
const ter = wynnTerritoryFile.territories
// const NodeWynn = require('node-wynn') // COMMENT: needed for requests to Wynncraft instead of Wynntils
// const testFile = require('./onlinePlayers.json')

// SECTION: begin color functions
const chalk = require('chalk')
const errors = chalk.bold.red
const warns = chalk.bold.yellow

// COMMENT: Minecraft Colors to ANSI list
const colors = { 0: '\u001b[0;30m', 1: '\u001b[0;34m', 2: '\u001b[0;32m', 3: '\u001b[0;36m', 4: '\u001b[0;31m', 5: '\u001b[0;35m', 6: '\u001b[0;33m', 7: '\u001b[0;37m', 8: '\u001b[1;30m', 9: '\u001b[1;34m', a: '\u001b[1;32m', b: '\u001b[1;36m', c: '\u001b[1;31m', d: '\u001b[1;35m', e: '\u001b[1;33m', f: '\u001b[1;37m', l: '\u001b[1m', r: '\u001b[0m', m: '\u001b[4m', n: '\u001b[4m', o: '\u001b[3m', k: '\u001b[5m' }

// COMMENT: This is used to add resets to the beginning and ends of messages
function r (msg) {
  return '§r' + msg + '§r'
}
// COMMENT: colorize your message, but not used since chalk exists
/*
function c (c, msg) {
  return '§r' + '§' + c + msg + '§r'
}
*/
// COMMENT: MInecraft Colors to ANSI function
function mccolor (str) {
  return str.replace(/§([0-9a-z])/g, function (m, contents) {
    return colors[contents] || '\u001b[0m'
  })
}
// COMMENT: strip all ansi in text
/*
function stripansi (str) {
  return str.replace(/\[\d+\w/g, '')
}
*/
// COMMENT: strip all color code in text
function stripthes (str) {
  return str.replace(/§(?:[0-9a-z])/g, '')
}
// SECTION: end color functions
let nowDate = `[${new Date(Date.now()).toLocaleString('en-US')}]`
let now = `[${new Date(Date.now()).toLocaleTimeString('en-US')}]`
setInterval(() => {
  nowDate = `[${new Date(Date.now()).toLocaleString('en-US')}]`
  now = `[${new Date(Date.now()).toLocaleTimeString('en-US')}]`
}, 1000)

// SECTION: begin logging
const fileName = path.join('logs', `chat-${new Date(Date.now()).toLocaleDateString().replace(/\//g, '_')}.json`)
let data = {}
function logging () {
  // COMMENT: handle rejections here I guess
  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Unhandled Rejection at: "${promise}"`)
    console.error(`Reason: "${reason}"`)
    // Application specific logging, throwing an error, or other logic here
  })
  // COMMENT: all of the writestreams are located here
  const ls = fs.createWriteStream(`./logs/log-${new Date(Date.now()).toLocaleDateString().replace(/\//g, '_')}.txt`, { flags: 'a' }) // COMMENT: just unformatted chat messages
  const ds = fs.createWriteStream(`./logs/debug/debug-${new Date(Date.now()).toLocaleDateString().replace(/\//g, '_')}.txt`, { flags: 'a' }) // COMMENT: formatted chat messages and debug

  // COMMENT: This logging was used with the mineflayer-dashboard logger, however I don't use the dashboard anymore
  console.log = function () {
    const text = util.format.apply(this, arguments) + '\n'
    ds.write(nowDate + ' [LOG] ' + text) // COMMENT: write to log formatted
    if (config.debug === true) {
      ls.write(nowDate + ' [LOG] ' + stripthes(text)) // COMMENT: write to log unformatted
      process.stdout.write(nowDate + ' [LOG] ' + text)
    }
  }
  console.warn = function () {
    const text = util.format.apply(this, arguments) + '\n'
    ds.write(nowDate + ' [WARN] ' + text) // COMMENT: write to log formatted
    ls.write(nowDate + ' [WARN] ' + stripthes(text)) // COMMENT: write to log unformatted
    process.stdout.write(nowDate + ` ${warns('[WARN]')} ` + warns(text))
  }
  console.error = function () {
    const text = util.format.apply(this, arguments) + '\n'
    ds.write(nowDate + ' [ERR] ' + text) // COMMENT: write to log formatted
    ls.write(nowDate + ' [ERR] ' + stripthes(text)) // COMMENT: write to log unformatted
    process.stdout.write(nowDate + ` ${errors('[ERR]')} ` + errors(text))
  }
  console.debug = function () {
    const text = util.format.apply(this, arguments) + '\n'
    ds.write(nowDate + ' [DBUG] ' + text) // COMMENT: write to log formatted
    if (config.debug === true) {
      process.stdout.write(nowDate + ' [DEBUG] ' + text)
    }
  }
  // COMMENT: info is used for chat messages
  console.info = function () {
    const text = util.format.apply(this, arguments) + '\n'
    const chat = util.format.apply(this, arguments)
    ds.write(nowDate + ' [CHAT] ' + text) // COMMENT: write to log formatted
    ls.write(nowDate + ' [CHAT] ' + stripthes(text)) // COMMENT: write to log unformatted
    process.stdout.write(nowDate + ' [CHAT] ' + mccolor(r(text)))
    // COMMENT: log chat with timestamp
    // COMMENT: code from U9G
    if (text.trim() === '') return
    const index = new Date(Date.now()).toLocaleString()
    data[index] = stripthes(chat)
  }
  console.verbose = function () {
    const text = util.format.apply(this, arguments) + '\n'
    ds.write(nowDate + ' [VERBOSE] ' + text)
  }
}
logging()
// SECTION: end logging / begin Discord
client.login(cred.discordToken)
  .catch(error => {
    console.error(error)
  })
client.once('ready', () => {
  // COMMENT: I am fancy and want the title to be WCA once it is logged into discord.
  process.title = config.processTitle ? config.processTitle : 'WCA'
  console.warn(`Logged into Discord as ${client.user.tag}`)
  client.guilds.cache.get(config.guildid).channels.cache.get(config.bombChannel).bulkDelete(100) // COMMENT: how do you delete specific messages after a certain time
  runBot(client)
})
// SECTION: end Discord / begin WCA
function runBot (client) {
  discordStatus('starting')
  // COMMENT: "global" variables
  let bot
  let onWynncraft = false
  let onAWorld = false
  let currentWorld = 'WC0'
  let resourcePackLoading = false
  let compassCheck = false
  let resourcePackSendListener
  let realUsername
  // let nickUsername
  let playerAPICheck
  let cancelCompass
  let hubTimer
  // COMMENT: run this function whenever I recieve a discord message
  client.on('message', async message => {
    runDiscord(message)
  })
  function loginBot () {
    // COMMENT: don't have two bots at once please
    if (onWynncraft === true) {
      console.error('Session already started. Kicking')
      bot.emit('kicked', 'this_should_never_fire')
    }
    // COMMENT: get playercount of every world every 30 seconds
    writeOnlinePlayers()
    playerAPICheck = setInterval(async () => {
      writeOnlinePlayers()
      discordStatus()
    }, 30000)
    // COMMENT: use config values if no arguments
    const version = config.version
    const ip = process.argv[4] ? process.argv[4] : config.ip
    const port = process.argv[5] ? process.argv[5] : config.port
    const user = process.argv[2] ? process.argv[2] : cred.username
    const pass = process.argv[3] ? process.argv[3] : cred.password
    bot = mineflayer.createBot({
      version: version,
      host: ip,
      port: port,
      username: user,
      password: pass,
      viewDistance: 'tiny',
      hideErrors: false,
      checkTimeoutInterval: 60000
    })
    // bot.setMaxListeners(69) // COMMENT: until they fix world switching memory bug
    // COMMENT: load plugins
    bot.loadPlugin(tpsPlugin)
    // COMMENT: should be a list of functions to run when starting up the WCA
    // COMMENT: have the exit handlers run first before anything else
    exitHandler()
    // COMMENT: then run everything
    everything()
    bombTracker()
    guildTracker()
    shoutTracker()
  }
  // COMMENT: loginBot() is used to restart the bot when it is disconnected from the server
  loginBot()

  // SECTION: end WCA / begin functions
  // TODO: Seperate everything into their own functions
  function everything () {
    bot.once('spawn', async () => {
      // COMMENT: prismarine-viewer isn't needed for this bot but it looks cool
      // mineflayerViewer(bot, { viewDistance: 8, port: config.viewerPort, firstPerson: false })
      data = await getData()
      setInterval(write, 10000)
    })
    bot.once('login', async function onceLoginListenerFunction () {
      onceLogin()
    })
    bot.on('login', async function onLoginListenerFunction () {
      onLogin()
    })
    bot.on('windowOpen', async function onWindowOpenListenerFunction (window) {
      onWindowOpen(window)
    })
    // COMMENT: This is special regexes for logging and when I can't detect special chats via chatAddPattern
    bot.on('message', async function onMessageListenerFunction (message) {
      onMessage(message)
    })
    bot.on('bossBarUpdated', async function onBossBarUpdatedListenerFunction (bossBar) {
      onBossBarUpdated(bossBar)
    })
    // COMMENT: Normal chat is pretty much everything but actionbar messages
    bot.chatAddPattern(
      /^((?!.+ \d+\/\d+ {4}(?:.*) {4}. \d+\/\d+).+)$/,
      'normalChat'
    )
    bot.on('normalChat', async function onNormalChatListenerFunction (message) {
      onNormalChat(message)
    })
    // COMMENT: execute other things in everything
  }
  function bombTracker () {
    if (config.bombTracker === false) return
    bot.chatAddPattern(
      // COMMENT: Bomb Bell tracking
      /^(\[Bomb Bell\] (.+) has thrown a (.+) Bomb on (WC\d+))$/,
      'logBomb'
    )
    bot.chatAddPattern(
      // COMMENT: Poor man's Bomb tracking
      /^(\[(\w+) . (?:.+)\] (.+) on (WC\d+) )$/,
      'logBomb'
    )
    bot.chatAddPattern(
      // COMMENT: Current Bomb tracking
      /^((\w+) has thrown a (.+) Bomb!.*)$/,
      'logBomb'
    )
    bot.on('logBomb', async function onLogBombListenerFunction (message, username, bomb, world) {
      onLogBomb(message, username, bomb, world)
    })
  }
  function guildTracker () {
    if (config.guildTracker === false) return
    bot.chatAddPattern(
      // COMMENT: Territory tracking
      /^\[WAR\] The war for (.+) will start in (\d+) (.+)\.$/,
      'logTerritory'
    )
    bot.chatAddPattern(
      // COMMENT: Guild Bank tracking
      /^\[INFO\] ((.+) (deposited|withdrew) (\d+x) (.+) (from|to) the Guild Bank \((.+)\))$/,
      'logGuildBank'
    )
    bot.on('logTerritory', async function onLogTerritoryListenerFunction (territory, time, minutes) {
      onLogTerritory(territory, time, minutes)
    })
    bot.on('logGuildBank', async function onLogGuildBankListenerFunction (message, username, deposit, amount, item, fromto, rank) {
      // COMMENT: Guild
      logGuildBankToDiscord(message, username, deposit, amount, item, fromto, rank)
    })
  }
  function shoutTracker () {
    if (config.shoutTracker === false) return
    bot.chatAddPattern(
      // COMMENT: Shout tracking
      /^((\w+) \[(WC\d+)\] shouts: (.+))$/,
      'logShout'
    )
    bot.on('logShout', async function onLogShoutListenerFunction (message, username, world, shoutMessage) {
      // COMMENT: Shouts
      logShoutToDiscord(message, username, world, shoutMessage)
    })
  }
  // SECTION: behind the scenes functions that need to go into their own files
  async function onceLogin () {
    console.warn('Connected to Wynncraft.')
    // COMMENT: onWynncraft is set to true on startup
    onWynncraft = true
    client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(nowDate + `${config.firstConnectMessage}`)
  }
  async function onLogin () {
    clearInterval(cancelCompass)
    // COMMENT: onAWorld is used for whenever the WCA successfully logs into a world that isn't the hub
    // COMMENT: resoucePackLoading is used for waiting for the resource pack to load
    onAWorld = false
    resourcePackLoading = false
    // COMMENT: clear any compass checks
    // COMMENT: fallback to WC0 until the world is online
    currentWorld = 'WC0'
    discordStatus() // COMMENT: check discord status
    console.warn('Connected.')
    // COMMENT: Wait for the chunks to load before checking
    await bot.waitForChunksToLoad()
    if (compassCheck === true) {
      setTimeout(() => {
        compass()
      }, 5000)
    } else {
      compass()
    }
  }
  function compass () {
    // COMMENT: If already on a world, loading the resource pack or is has been kicked from the server, then do nothing
    if (onAWorld === true || onWynncraft === false || resourcePackLoading === true) {
      return
    }
    console.log('compass check')
    bot.setQuickBarSlot(0)
    bot.updateHeldItem()
    // COMMENT: assume that bot is slightly stuck if the held item is nothing
    setTimeout(() => {
      if (bot.heldItem === null || bot.heldItem === undefined) {
        console.log(bot.heldItem)
      } else {
        const itemHeld = bot.heldItem.name
        console.log(itemHeld)
        // COMMENT: click on the recommended world if holding a compass
        // TODO: maybe have it select a world with low player count and/or low uptime
        // I want to minimize it taking up player slots in critical areas
        function compassActivate () {
          console.warn('Connecting to WC...')
          client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.worldReconnectMessage}`)
          bot.activateItem()
        }
        if (itemHeld === 'compass') {
          // COMMENT: retry on lobby or restart entire bot if hub is broken
          compassActivate()
          cancelCompass = setInterval(() => {
            if (onWynncraft === true && onAWorld === false && resourcePackLoading === false) {
              compassActivate()
            }
          }, 15000)
        }
      }
    }, 1000)
    // if (itemHeld === 'bow' || itemHeld === 'wooden_shovel' || itemHeld === 'iron_shovel' || itemHeld === 'stone_shovel' || itemHeld === 'shears') {
    //  bot.setQuickBarSlot(7)
    // }
  }
  async function onWindowOpen (window) {
    window.requiresConfirmation = false
    // COMMENT: this is used so that I can technically support any gui in one section of my code
    const win = JSON.parse(window.title)
    if (win.text === 'Wynncraft Servers') {
      // COMMENT: Hardcoded to click on the recommended server slot - might need to be changed if Wynncraft updates their gui
      await bot.clickWindow(13, 0, 0)
      compassCheck = true
    } else if (win.text === '§8§lSelect a Class') {
      console.error(`somehow in class menu "${win.text}" going to hub - use /toggle autojoin`)
      bot.closeWindow(window)
      hub()
    } else {
      // COMMENT: debugging purposes, this shouldn't happen unless stuck in the class menu
      console.error(`opened unknown gui with title "${win.text}"`)
      bot.closeWindow(window)
    }
  }
  async function onMessage (message) {
    const messageMotd = String(message.toMotd())
    // const messageString = String(message.toString())
    // const messageAnsi = message.toAnsi()
    realUsername = null
    // COMMENT: Exclude spam has many messages that clutter up your chat such as level up messages and other stuff like that
    const excludeSpam = /^(?:.+ \d+\/\d+ {4}(?:.*) {4}. \d+\/\d+|.+ is now level .*|\[Info\] .+|As the sun rises, you feel a little bit safer...|\[\+\d+ Soul Points?\]|You still have \d+ unused skill points! Click with your compass to use them!)$/
    if (excludeSpam.test(message.toString())) {
      return
    } else {
      console.info(`${message.toMotd()}`)
    }
    // COMMENT: exclude the actionbar because that is the most spammy
    const excludeActionbar = /^(?:.+ \d+\/\d+ {4}(?:.*) {4}. \d+\/\d+)$/
    if (!excludeActionbar.test(message.toString())) {
      const jsonString = JSON.stringify(message.json)
      console.verbose(jsonString)
      // const jsonParsed = message.json
      // COMMENT: Champion Nickname detector - used to get the real username of the bomb thrower and guild messages
      if (message.json.extra) {
        for (let i = 0; i < message.json.extra.length; i++) {
          if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
            realUsername = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
            // nickUsername = message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[0]?.text
            // console.log(realUsername)
            // console.log(nickUsername)
          }
        }
      }
      const guildMessageRegex = /§r§3\[(?:|§r§b(★|★★|★★★|★★★★|★★★★★))§r§3(.*)\]§r§b (.*)§r/
      if (guildMessageRegex.test(messageMotd)) {
        const matches = guildMessageRegex.exec(messageMotd)
        if (matches[2] === 'INFO') {
          return
        }
        const [fullMatch, guildRank, guildUsername, guildMessage] = matches
        logGuildMessageToDiscord(fullMatch, guildRank, guildUsername, guildMessage)
      }
      const guildJoinRegex = /§r§b(\w+)§r§3 has logged into server §r§b(\w+)§r§3 as §r§ba (\w+)§r/
      if (guildJoinRegex.test(messageMotd)) {
        const matches = guildJoinRegex.exec(messageMotd)
        if (matches[1] === bot.username) {
          return
        }
        const [fullMatch, guildUsername, guildWorld, guildClass] = matches
        logGuildJoinToDiscord(fullMatch, guildUsername, guildWorld, guildClass)
      }
    }
  }
  async function onNormalChat (message) {
    if (message === 'You\'re rejoining too quickly! Give us a moment to save your data.' || message === 'You are already connected to this server!') {
      compassCheck = true
    }
    if (message === 'Loading Resource Pack...') {
      console.warn('Connected and Loading Resource Pack...')
      compassCheck = false
      resourcePackLoading = true
      if (resourcePackSendListener) bot.removeListener('resource_pack_send', resourcePackSendListener)
      clearInterval(cancelCompass)
      discordStatus() // COMMENT: check discord status
      // COMMENT: Accept the resource pack on login: Thanks mat#6207 for giving the code
      resourcePackSendListener = function onceResourcePackSendListenerFunction () {
        bot._client.write('resource_pack_receive', {
          result: 3
        })
        bot._client.write('resource_pack_receive', {
          result: 0
        })
        console.log('Wynnpack accepted.')
        resourcePackLoading = false
      }
      bot._client.once('resource_pack_send', resourcePackSendListener)
    }
    if (message === 'Server restarting!' || message === 'The server you were on previously has went down. You have been connected to a fallback server') {
      client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.hubRestartMessage} <@!${config.masterDiscordUser}>`)
    }
    const bombRegex = /^Want to thank (.+)\? Click here to thank them!$/
    if (bombRegex.test(message)) {
      // COMMENT: get off the server if an bomb is thrown - some people do item bomb parties
      hubTimer = setTimeout(() => {
        console.log(`going to hub because bomb was thrown on ${currentWorld}`)
        client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.bombRestartMessage} <@!${config.masterDiscordUser}>`)
        hub()
      }, 2000)
    }
    const botJoinRegex = /(\w+) has logged into server (\w+) as (?:a|an) (.+)/
    if (botJoinRegex.test(message)) {
      const matches = botJoinRegex.exec(message)
      if (matches[1] === bot.username) {
        const [, username, world, wynnclass] = matches
        logOnline(username, world, wynnclass)
        // logGuildJoinToDiscord(message, username, world, wynnclass)
      }
    }
  }
  async function onBossBarUpdated (bossBar) {
    // COMMENT: get off the server if a bomb is in the bossbar
    const bombBarRegex = /(.+) from (.+) \[(\d+) min\]/
    const bossBarString = stripthes(bossBar.title.text)
    if (bombBarRegex.test(bossBarString)) {
      clearTimeout(hubTimer)
      console.log(`going to hub because bomb was thrown on ${currentWorld}`)
      client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.bombRestartMessage} <@!${config.masterDiscordUser}>`)
      hub()
    }
  }
  async function onLogBomb (message, username, bomb, world) {
    // COMMENT: Bomb tracking stuff
    const santitze = /(\[.+\] .+: .*|\[.* . .*\] .*|.* whispers to you:)/g
    const santitzeMessage = String(message)
    const timeLeft = null
    if (username === config.masterUser || realUsername === config.masterUser) {
      // COMMENT: you PM the bot "Combat XP on WC1" and it will get a random player from that world and post the bomb to discord
      const randomPlayer = getRandomPlayer(world)
      logBombToDiscord(message, randomPlayer, bomb, world, timeLeft)
    } else {
      // COMMENT: Santize input so that other people can't execute it via DMs
      if (santitze.test(santitzeMessage)) return
      logBombToDiscord(message, username, bomb, world, timeLeft)
    }
  }
  async function onLogTerritory (territory, time, minutes) {
    // COMMENT: If this ever fires, Wynncraft changed their wars
    if (minutes === 'minute') {
      console.error('A territory message was sent as a minute.')
      return
    }
    if (minutes !== 'seconds' || minutes !== 'second') {
      territoryTracker(territory, time)
    }
  }
  async function territoryTracker (territory, time) {
    // COMMENT: track guild territory
    const duration = time
    const territoryLocation = await getTerritoryLocation(territory)
    const territoryMessage = `${now} <@&${config.territoryRole}> War for **${territory}** (${territoryLocation})`
    client.guilds.cache.get(config.guildid).channels.cache.get(config.territoryChannel).send(territoryMessage + ` starts in **[${time}:00]**`)
      .then(msg => {
        territoryTimer(msg, territoryMessage, duration)
      })
  }
  async function territoryTimer (msg, territoryMessage, duration) {
    // COMMENT: guild territory timer (copy of bombCountDown())
    const durationInSeconds = duration * 60
    const timers = new Timer()
    let counter = 0
    let timeLeftMinutes = timers.getTimeValues().minutes
    let timeLeftSeconds = timers.getTimeValues().seconds
    timers.start({ countdown: true, startValues: { seconds: durationInSeconds }, target: { seconds: 0 }, precision: 'seconds' })
    timers.addEventListener('targetAchieved', async () => {
      timers.stop()
      timers.removeEventListener('minutesUpdated')
      timers.removeEventListener('targetAchieved')
      counter = 1
      msg.edit(territoryMessage + ' starts in **[NOW]**')
        .then(msg => {
          setTimeout(() => {
            msg.delete()
          }, 5000)
        })
    })
    timers.addEventListener('secondsUpdated', async () => {
      timeLeftMinutes = timers.getTimeValues().minutes
      timeLeftSeconds = timers.getTimeValues().seconds
      counter = counter + 1
      if (counter < 15) {
        return
      }
      if (timeLeftSeconds === 0) {
        timeLeftSeconds = '00'
      }
      counter = 0
      msg.edit(territoryMessage + ` starts in **[${timeLeftMinutes}:${timeLeftSeconds}]**`)
    })
  }
  async function logGuildMessageToDiscord (fullMessage, rank, username, message) {
    // COMMENT: Use their real username if they are a Champion nick
    if (realUsername !== null) username = realUsername
    const guildMessagePrefix = now + ' '
    const guildEmoji = config.guildEmoji ? config.guildEmoji : '🚩'
    let guildMessageSuffix
    if (rank === undefined) {
      guildMessageSuffix = `${guildEmoji} [**${username}**] ${message}`
    } else {
      guildMessageSuffix = `${guildEmoji} [**${rank}${username}**] ${message}`
    }
    client.guilds.cache.get(config.guildid).channels.cache.get(config.guildChatChannel).send(guildMessagePrefix + guildMessageSuffix)
  }
  async function logGuildJoinToDiscord (fullMessage, username, world, wynnclass) {
    const guildPrefix = now + ' '
    const guildEmoji = config.guildEmoji ? config.guildEmoji : '🚩'
    const guildSuffix = `${guildEmoji} ▶️ **${username}**`
    client.guilds.cache.get(config.guildid).channels.cache.get(config.guildChatChannel).send(guildPrefix + guildSuffix)
  }
  async function logGuildBankToDiscord (message, username, deposit, amount, item, fromto, rank) {
    // COMMENT: Use their real username if they are a Champion nick
    if (realUsername !== null) username = realUsername
    // COMMENT: track guild bank messages
    console.log(`detected a ${deposit}`)
    const bankMessagePrefix = now + ''
    const bankMessageSuffix = `**${amount}** ${item} by **${username}** [${rank}]`
    if (deposit === 'withdrew') {
      // COMMENT: Do this if someone took something from the guild bank
      const bankEmoji = config.bankEmojiWithdraw ? config.bankEmojiWithdraw : '⏪'
      const sentBankMessage = `${bankMessagePrefix} ${bankEmoji} ${bankMessageSuffix}`
      client.guilds.cache.get(config.guildid).channels.cache.get(config.guildBankChannel).send(sentBankMessage + '')
    }
    if (deposit === 'deposited') {
      // COMMENT: Do this if someone put something into the guild bank
      const bankEmoji = config.bankEmojiDeposit ? config.bankEmojiDeposit : '⏩'
      const sentBankMessage = `${bankMessagePrefix} ${bankEmoji} ${bankMessageSuffix}`
      client.guilds.cache.get(config.guildid).channels.cache.get(config.guildBankChannel).send(sentBankMessage + '')
    }
    // client.guilds.cache.get(config.guildid).channels.cache.get(config.logGuildBankChannel).send(now + `${message}`)
  }
  async function logBombToDiscord (fullMessage, username, bomb, world, timeLeft) {
    // COMMENT: Use their real username if they are a Champion nick
    if (realUsername !== null) username = realUsername
    // COMMENT: track some explosions
    console.log(`${bomb} bomb logged`)
    const bombMessagePrefix = now + ''
    if (world === undefined || world === null) {
      clearTimeout(hubTimer) // COMMENT: remove the timer if it is reported here
      // COMMENT: If world is somehow not defined, fallback to WC0 or WCA's current world
      world = currentWorld
      console.log(`going to hub because bomb was thrown on ${world}`)
      client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.bombRestartMessage}`)
      hub()
    }
    const bombMessageSuffix = `**${world}** by \`${username}\``
    const playerCount = listOnlinePlayers(world)
    // COMMENT: adjust this number and the number in bombCountDown() to the max playercount
    const playerCountMax = '40'
    // COMMENT: Sort the bombs
    if (bomb === 'Combat XP') {
      let bombTime
      if (timeLeft === null) {
        bombTime = 20 // COMMENT: duration in minutes of the bomb when thrown (Combat XP is 20 minutes)
      } else {
        bombTime = timeLeft
      }
      const bombRole = config.combatXPRole ? config.combatXPRole : '[Combat XP]'
      const bombEmoji = config.combatXPEmoji ? config.CombatXPEmoji : '▶️'
      const bombChannel = config.combatXPChannel ? config.combatXPChannel : config.bombChannel
      const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
      // COMMENT: display duration of bomb and playercount/max
      const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
      client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
        .then(msg => {
          bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
          writeBombStats(world, bomb)
        })
    } else if (bomb === 'Dungeon') {
      let bombTime
      if (timeLeft === null) {
        bombTime = 10
      } else {
        bombTime = timeLeft
      }
      const bombRole = config.dungeonRole ? config.dungeonRole : '[Dungeon]'
      const bombEmoji = config.dungeonEmoji ? config.dungeonEmoji : '▶️'
      const bombChannel = config.dungeonChannel ? config.dungeonChannel : config.bombChannel
      const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
      const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
      client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
        .then(msg => {
          bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
          writeBombStats(world, bomb)
        })
    } else if (bomb === 'Loot') {
      let bombTime
      if (timeLeft === null) {
        bombTime = 20
      } else {
        bombTime = timeLeft
      }
      const bombRole = config.lootRole ? config.lootRole : '[Loot]'
      const bombEmoji = config.lootEmoji ? config.lootEmoji : '▶️'
      const bombChannel = config.lootChannel ? config.lootChannel : config.bombChannel
      const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
      const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
      client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
        .then(msg => {
          bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
          writeBombStats(world, bomb)
        })
    } else if (bomb === 'Profession Speed') {
      let bombTime
      if (timeLeft === null) {
        bombTime = 10
      } else {
        bombTime = timeLeft
      }
      const bombRole = config.professionSpeedRole ? config.professionSpeedRole : '[Profession Speed]'
      const bombEmoji = config.professionSpeedEmoji ? config.professionSpeedEmoji : '▶️'
      const bombChannel = config.professionSpeedChannel ? config.professionSpeedChannel : config.bombChannel
      const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
      const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
      client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
        .then(msg => {
          bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
          writeBombStats(world, bomb)
        })
    } else if (bomb === 'Profession XP') {
      let bombTime
      if (timeLeft === null) {
        bombTime = 20
      } else {
        bombTime = timeLeft
      }
      const bombRole = config.professionXPRole ? config.professionXPRole : '[Profession XP]'
      const bombEmoji = config.professionXPEmoji ? config.professionXPEmoji : '▶️'
      const bombChannel = config.professionXPChannel ? config.professionXPChannel : config.bombChannel
      const sentBombMessage = `${bombMessagePrefix} ${bombEmoji} <@&${bombRole}> ${bombMessageSuffix}`
      const timerMessage = ` (**${bombTime}** minutes left) **[${playerCount}/${playerCountMax}]**`
      client.guilds.cache.get(config.guildid).channels.cache.get(bombChannel).send(sentBombMessage + timerMessage)
        .then(msg => {
          bombCountDown(msg, sentBombMessage, bombTime, world, playerCountMax)
          writeBombStats(world, bomb)
        })
    } else {
      // COMMENT: If it doesn't match: (Combat XP, Loot, Dungeon, Profession Speed, Profession XP) then log the error
      console.error(bomb)
    }
    client.guilds.cache.get(config.guildid).channels.cache.get(config.logBombChannel).send(now + ` ${fullMessage}`)
  }
  async function bombCountDown (msg, message, duration, world, playerCountMax) {
    const timer = new Timer()
    let counter = 1
    timer.stop()
    timer.start({ countdown: true, startValues: { minutes: duration }, target: { minutes: 0 }, precision: 'seconds' })
    // COMMENT: target is met (0 minutes), delete message and stop timer
    timer.addEventListener('targetAchieved', () => {
      msg.delete()
        .then(console.log('Bomb Message deleted'))

      timer.removeEventListener('minutesUpdated')
      timer.removeEventListener('targetAchieved')
      counter = 1
      timer.stop()
    }) // COMMENT: otherwise edit the message with the current time left
    timer.addEventListener('secondsUpdated', async () => {
      counter = counter + 1
      if (counter <= 30) {
        return
      }
      counter = 1
      const timeLeftMinutes = timer.getTimeValues().minutes
      if (timeLeftMinutes === 0) {
        return
      }
      const playerCount = listOnlinePlayers(world)
      msg.edit(message + ` (**${timeLeftMinutes} minutes** left) **[${playerCount}/${playerCountMax}]**`)
    })
  }
  async function logShoutToDiscord (fullMessage, username, world, shoutMessage) {
    // COMMENT: Custom Shout Message Formatting
    client.guilds.cache.get(config.guildid).channels.cache.get(config.shoutChannel).send(now + ` [${world}] \`${username}\`: \`${shoutMessage}\``)
  }
  async function logOnline (username, world, wynnclass) {
    // COMMENT: Online Tracker
    if (username !== bot.username) {
      return
    }
    // COMMENT: Your now on a world - you have stopped loading resource pack lol
    onAWorld = true
    resourcePackLoading = false
    // COMMENT: Set the currentWorld to the current World instead of WC0
    currentWorld = world
    client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.worldConnectMessage}`)
    discordStatus() // COMMENT: check discord status
  }
  async function getTerritoryLocation (territoryName) {
    let territoryCoordinates
    const message = territoryName
    // COMMENT: return null if territory with that name is not found
    const terIsNull = ter[`${message}`]
    if (terIsNull === undefined || terIsNull === null) {
      // COMMENT: check if the file is null
      territoryCoordinates = 'null, null'
    } else {
      // COMMENT: otherwise calculate and return the middle of the territory
      // const terName = ter[`${message}`].territory
      const terStartX = ter[`${message}`].location.startX
      const terStartY = ter[`${message}`].location.startY
      const terEndX = ter[`${message}`].location.endX
      const terEndY = ter[`${message}`].location.endY
      // COMMENT: Midpoint calculation
      const terX = Math.trunc((terStartX + terEndX) / 2)
      const terY = Math.trunc((terStartY + terEndY) / 2)
      territoryCoordinates = `${terX}, ${terY}`
    }
    return territoryCoordinates
  }
  function hub () {
    if (onAWorld === true && resourcePackLoading === false) {
      bot.chat('/hub')
    }
  }
  async function runDiscord (message) {
    // COMMENT: if message doesn't start with the prefix, message author is WCA
    if (!message.content.startsWith(config.prefix) || message.author.bot) {
      return
    }
    const args = message.content.slice(config.prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()
    let bypassRole = false
    if (message.member.roles.cache.has(config.masterDiscordRole)) {
      // COMMENT: "Trusted Role Commands"
      // COMMENT: People with this role can use this command anywhere.
      switch (command) {
        case 'help': {
          message.channel.send(
          `\`\`\`Trusted:
          stop = stops the WCA
          exit = panic command to stop everything
          sudo = sudo the bot to do something in chat / make sure you put a slash before any commands
          tps = get current tps on world\`\`\``
          )
          break
        }
        case 'stop': {
          if (onWynncraft === false) {
            message.channel.send(`Already offline, type ${config.prefix}start to connect tp Wynncraft.`)
            return
          }
          bot.emit('kicked', 'discord')
          console.warn(`WCA has quit game due to ${config.prefix}stop from discord`)
          message.channel.send(`WCA has quit game due to discord - type ${config.prefix}start to start it`)
          client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.stopWCA}`)
          break
        }
        case 'exit': {
          console.warn('exiting via discord uwu')
          message.channel.send('exiting bot process')
          process.emit('SIGINT')
          break
        }
        case 'sudo': {
          const sudoMessage = args.join(' ')
          console.warn(`executed "${sudoMessage}"`)
          bot.chat(sudoMessage)
          message.channel.send(`executed \`${sudoMessage}\``)
          break
        }
        case 'tps': {
          const tps = bot.getTps()
          message.channel.send(`[${currentWorld}] TPS: ${tps}`)
          break
        }
        /* case 'npc': {
          // COMMENT: entire NPC function interacts with the world and might be bannable
          if (!args.length) {
            message.channel.send('reset npc intervals')
            npc()
          } else if (args[0]) {
            const argument = args[0]
            npc(argument)
            message.channel.send(`staring at ${argument}`)
          }
          break
        } */
      }
    }
    if (message.member.roles.cache.has(config.masterDiscordRole) || message.member.roles.cache.has(config.trustedDiscordRole)) {
      bypassRole = true
      switch (command) {
        // COMMENT: "Truwusted Role Commands"
        // COMMENT: People with this role can use this command anywhere.
        case 'help': {
          message.channel.send(
          `\`\`\`Truwusted:
          start = starts the WCA
          hub = go to hub and join a new world
          compass = force compass check
          stream = toggle stream mode\`\`\``
          )
          break
        }
        case 'start': {
          if (onWynncraft === true) {
            message.channel.send(`Already online, type ${config.prefix}stop to quit Wynncraft.`)
            return
          }
          loginBot()
          console.warn(`WCA has joined game - due to ${config.prefix}start from Discord.`)
          message.channel.send('starting WCA')
          client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.startWCA}`)
          break
        }
        case 'hub': {
          hub()
          console.warn('going to hub...')
          message.channel.send('going to hub...')
          break
        }
        case 'compass': {
          if (onAWorld === true) {
            message.channel.send('fail: already on a world')
            return
          }
          if (onWynncraft === false) {
            message.channel.send('fail: offline')
            return
          }
          compass()
          console.warn('executing compass script')
          message.channel.send('executing compass script')
          break
        }
        case 'stream': {
          bot.chat('/stream')
          message.channel.send('Toggled stream mode.')
          break
        }
      }
    }
    if (bypassRole === false) {
      if (message.channel.id !== config.commandChannel) return
    }
    switch (command) {
      // COMMENT: Anyone can use these commands in the command channel
      case 'null': {
        message.channel.send('null')
        break
      }
      case 'help': {
        message.channel.send(
        `\`\`\`Everyone:
        null = returns null
        help = returns this help message
        random = returns a random player on that specific world
        bomb = get bomb stats of a specific world\`\`\``
        )
        break
      }
      case 'random': {
        if (!args.length) {
          message.channel.send('Specify a world to fetch a random player')
        } else if (args[0]) {
          const argument = args[0]
          const answer = getRandomPlayer(argument)
          message.channel.send(`\`${answer}\``)
        }
        break
      }
      // COMMENT: uwu
      case 'bomb': {
        if (!args.length) {
          message.channel.send('Specify a world for stats')
        } else if (args[2]) {
          message.channel.send(`Too many arguments, try ${config.prefix}bomb WC0 Combat_XP or ${config.prefix}bomb WC0`)
        } else if (args[0]) {
          const argument1 = args[0]
          const argument2 = args[1]
          const answer = getBombStats(argument1, argument2)
          if (answer === null) {
            message.channel.send('Internal error occured')
            return
          }
          message.channel.send(answer)
        }
      }
    }
  }
  // COMMENT: entire NPC function below is "interacting" with the world and may get it banned
  /*
  let npcInterval
  async function npc (username) {
    if (username === null || onWynncraft === false) {
      clearInterval(npcInterval)
    } else {
      // COMMENT: check for entity type = player, username matches specified player, and the distance is 5 or under
      const filter = e => e.type === 'player' && e.username === username && e.position.distanceTo(bot.entity.position) < 5
      // let sneak = false
      function lookAtPlayer () {
        // COMMENT: target the specified player
        const target = bot.nearestEntity(filter)
        // COMMENT: if there is no target - look south
        if (!target) {
          // bot.setControlState('sneak', false)
          // sneak = false
          bot.look(Math.PI, 0)
          return
        }
        // COMMENT: use this if you want to have it immediately headsnap to the player
        // bot.lookAt(target.position.offset(0, target.height, 0), true)

        // COMMENT: Sneak Spam - if you uncomment, you will get banned
        // if (sneak === false) {
        //   bot.setControlState('sneak', true)
        //   sneak = true
        // } else {
        //   bot.setControlState('sneak', false)
        //   sneak = false
        // }

        // const playerPosition = target.position.offset(0, target.height, 0)
        // const botPosition = bot.entity.position.offset(0, 0, 0)
        const positionX = (bot.entity.position.x - target.position.x)
        // const positionY = (bot.entity.position.y - target.position.y)
        const positionZ = (bot.entity.position.z - target.position.z)
        const lookAtPlayer = Math.atan2(positionX, positionZ)
        if (Math.abs((lookAtPlayer - bot.entity.yaw)) >= Math.PI) { // COMMENT: This is supposed to make the head movement less bot-like
          bot.look((lookAtPlayer - bot.entity.yaw) / 2, 0, true)
        } else {
          bot.look((lookAtPlayer + bot.entity.yaw) / 2, 0, true)
        }
      }
      npcInterval = setInterval(lookAtPlayer, 50)
    }
  } */
  let endProcess = false
  function exitHandler () {
    bot.on('kicked', function onKickedFunctionListener (reason, loggedIn) {
      onKick(reason, loggedIn)
    })
    bot.on('end', function onEndFunctionListener () {
      if (endProcess === true) return
      onKick('end_bot')
    })
    bot.on('error', async function onErrorFunctionListener (err) { console.error(err) })
  }
  process.once('SIGINT', function endSIGINT () {
    onProcessStop()
  })
  process.once('SIGHUP', function endSIGHUP () {
    onProcessStop()
  })
  process.once('SIGTERM', function endSIGTERM () {
    onProcessStop()
  })
  async function onKick (reason, loggedIn) {
    // COMMENT: Shut all the bot things down when kicked or disconnected
    onWynncraft = false
    onAWorld = false
    resourcePackLoading = false
    discordStatus() // COMMENT: check discord status // COMMENT: check discord status
    write() // COMMENT: write chat to the log file
    // npc()
    // bot.viewer.close() // COMMENT: remove this if you are not using prismarine-viewer
    clearInterval(cancelCompass)
    clearInterval(playerAPICheck)
    // clearInterval(npcInterval)
    console.error(reason, loggedIn)
    if (reason === 'end_process') {
      endProcess = true
      bot.quit()
      return
    }
    if (reason === 'end_bot') {
      reason = 'Disconnected'
      client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.kickMessage} \`${reason}\` <@!${config.masterDiscordUser}> <@&${config.masterDiscordRole}>`)
    } else {
      client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.kickMessage} \`${reason}\` <@!${config.masterDiscordUser}> <@&${config.masterDiscordRole}>`)
    }
  }
  async function onProcessStop () {
    onKick('end_process')
    setTimeout(() => {
      console.error('Exiting process NOW')
      process.exit()
    }, 9000)
    // COMMENT: When exiting, do these things
    // bot.viewer.close() // COMMENT: remove this if you are not using prismarine-viewer
    console.error('Exiting process in 9 seconds.')
    client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + ` ${config.processEndMessage} <@!${config.masterDiscordUser}>`)
    client.user.setStatus('invisible')
  }
  async function discordStatus (status) {
    if (status === 'starting') {
      client.user.setPresence({
        status: 'idle',
        activity: {
          name: 'connecting to wynncraft'
        }
      })
    } else {
      if (onWynncraft === true && onAWorld === true && resourcePackLoading === false) {
        client.user.setPresence({
          status: 'online',
          activity: {
            name: 'archiving chat - play.wynncraft.com'
          }
        })
      } else if (onWynncraft === true && onAWorld === false && resourcePackLoading === false) {
        client.user.setPresence({
          status: 'idle',
          activity: {
            name: 'in a lobby - play.wynncraft.com'
          }
        })
      } else if (onWynncraft === true && onAWorld === false && resourcePackLoading === true) {
        client.user.setPresence({
          status: 'idle',
          activity: {
            name: 'in class menu - play.wynncraft.com'
          }
        })
      } else if (onWynncraft === false && onAWorld === false && resourcePackLoading === false) {
        client.user.setPresence({
          status: 'dnd',
          activity: {
            name: `offline | type ${config.prefix}start to restart`
          }
        })
      } else {
        console.error(`Error when setting status: "onWynncraft": ${onWynncraft} | "onAWorld": ${onAWorld} | "resourcePackLoading": ${resourcePackLoading} `)
      }
    }
  }
}
async function writeOnlinePlayers () {
  // COMMENT: send a request to the Wynncraft API and write it to onlinePlayers.json
  /*
  NodeWynn
    .getOnline()
    .then((r) => {
      const json = JSON.stringify(r, null, 2)
      fs.writeFile('./onlinePlayers.json', json, err => {
        if (err) {
          console.error(err)
        }
      })
    })
    .catch(err => {
      console.error(err)
    }) */
  // COMMENT: switched to sending the request to wynntils
  axios.get('https://athena.wynntils.com/cache/get/serverList')
    .then(r => {
      const file = JSON.stringify(r.data, null, 2)
      fs.writeFile('./onlinePlayers.json', file, err => {
        if (err) {
          console.error(err)
        }
      })
    })
    .catch(error => { //  Handle errors
      console.log(error)
    })
}
function listOnlinePlayers (world) {
  // COMMENT: read onlinePlayers.json and return the playercount of the argument / world
  const parsed = JSON.parse(fs.readFileSync('./onlinePlayers.json', 'utf8'))
  let playerCountFromFile
  if (!parsed.servers[`${world}`]) {
    playerCountFromFile = '-1'
  } else {
    playerCountFromFile = Object.keys(parsed.servers[`${world}`].players).length
  }
  return playerCountFromFile
}
function getRandomPlayer (world) {
  // COMMENT: read onlinePlayers.json and pick a random player
  const parsed = JSON.parse(fs.readFileSync('./onlinePlayers.json', 'utf8'))
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

function writeBombStats (world, bomb) {
  // QUOTE: "this could be done so much better" - U9G
  // COMMENT: Add +1 to a specific bomb on a world
  const file = JSON.parse(fs.readFileSync('./WCStats.json', 'utf8'))
  console.log(world + ': ' + bomb)
  file[`${world}`][`${bomb}`] += 1
  const writeFile = JSON.stringify(file, null, 2)
  fs.writeFileSync('./WCStats.json', writeFile)
}
function getBombStats (world, stats) {
  // QUOTE: "this could be done so much better" - U9G
  // COMMENT: read onlinePlayers.json and pick a random player
  const parsed = JSON.parse(fs.readFileSync('./WCStats.json', 'utf8'))
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

// COMMENT: U9G thanks for code - this basically logs chat and only chat
async function getData () {
  if (!fs.existsSync(fileName)) await fs.promises.writeFile(fileName, '{\n}')
  return require(path.join(__dirname, fileName))
}
async function write () {
  if (!fs.existsSync(fileName)) await fs.promises.writeFile(fileName, '{\n}')
  await fs.promises.writeFile(fileName, JSON.stringify(data, null, 2))
}
