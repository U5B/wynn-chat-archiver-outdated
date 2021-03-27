process.env.DEBUG = 'DEBUG,CHAT,INFO,ERROR,WARN,VERBOSE,LOG'
// SECTION: Mineflayer modules
const mineflayer = require('mineflayer')
// const mineflayerViewer = require('prismarine-viewer').mineflayer
const tpsPlugin = require('mineflayer-tps')(mineflayer)

// SECTION: Discord modules
const discord = require('discord.js')
const client = new discord.Client({ disableMentions: 'everyone' })
const sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
exports.sleep = sleep

// SECTION: File system and other logging
// const process = require('process')
// const fs = require('fs')
// const axios = require('axios')

// COMMENT: other files

// SECTION: all of the configs I need and wynncraft api
const config = require('./modules/config/config.json')
const cred = require('./modules/config/cred.json')
// COMMENT: "global" variables
let bot = null
// let nickUsername

// SECTION: end logging / begin Discord
client.login(cred.discordToken)
exports.client = client
client.once('ready', async () => {
  // COMMENT: I am fancy and want the title to be WCA once it is logged into discord.
  process.title = config.processTitle ? config.processTitle : 'WCA'
  log.warn(`Logged into Discord as ${client.user.tag}`)
  await client.guilds.cache.get(config.guildid).channels.cache.get(config.bombChannel).bulkDelete(100) // COMMENT: how do you delete specific messages after a certain time
  // COMMENT: start the bot
  loginBot()
  // COMMENT: run this function whenever I recieve a discord message
  client.on('message', async message => {
    runDiscord(message)
  })
})

// SECTION: end Discord / begin WCA
function loginBot () {
  // COMMENT: don't have two bots at once please
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
  // COMMENT: load plugin
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
exports.loginBot = loginBot
const color = require('./modules/colors')
const simplediscord = require('./modules/simplediscord')
const log = require('./modules/logging')
const fileCheck = require('./modules/files')
const wcabomb = require('./modules/bomb')
const wcaguild = require('./modules/guild')
const wcachat = require('./modules/chat')
const wcaapi = require('./modules/api')
const universal = require('./modules/univariables')
const wacresourcepack = require('./modules/plugins/resourcepack')
const wcabotend = require('./modules/plugins/botEnd')
const wcabotlobby = require('./modules/plugins/botLobby')
const discordCommands = require('./modules/discord')

fileCheck.fileCheck()
// COMMENT: loginBot() is used to restart the bot when it is disconnected from the server
// SECTION: end WCA / begin functions
// TODO: Seperate everything into their own functions
function everything () {
  clearInterval(universal.apiInterval)
  universal.apiInterval = setInterval(() => {
    wcaapi.onlinePlayers()
    simplediscord.status()
  }, 30000)
  bot.once('spawn', onceSpawn)
  bot.once('login', onceLogin)
  bot.on('login', onLogin)
  bot.on('respawn', async function onRespawnListenerFunction () {
    log.log('Respawn event fired.')
  })
  bot.on('spawn', onSpawn)
  bot.on('windowOpen', onWindowOpen)
  // COMMENT: This is special regexes for logging and when I can't detect special chats via chatAddPattern
  bot.on('message', onMessage)
  bot.on('bossBarUpdated', onBossBarUpdated)
  // COMMENT: execute other things in everything
}
function bombTracker () {
  if (!config.bombTracker) return
  // COMMENT: Bomb Bell tracking
  bot.chatAddPattern(/^(\[Bomb Bell\] (.+) has thrown a (.+) Bomb on (WC\d+))$/, 'chat:logBomb')
  // COMMENT: PM Bomb tracking
  bot.chatAddPattern(/^(\[(\w+) . (?:.+)\] (.+) on (WC\d+) )$/, 'chat:logBomb')
  // COMMENT: Chat Bomb tracking
  bot.chatAddPattern(/^((\w+) has thrown a (.+) Bomb!.*)$/, 'chat:logBomb')
  bot.on('chat:logBomb', onLogBomb)
}
function guildTracker () {
  if (!config.guildTracker) return
  // COMMENT: Territory tracking
  bot.chatAddPattern(
    /^\[WAR\] The war for (.+) will start in (\d+) (.+)\.$/, 'chat:logTerritory')
  // COMMENT: Guild Bank tracking
  bot.chatAddPattern(/^\[INFO\] ((.+) (deposited|withdrew) (\d+x) (.+) (from|to) the Guild Bank \((.+)\))$/, 'chat:logGuildBank')
  bot.on('chat:logTerritory', onLogTerritory)
  bot.on('chat:logGuildBank', onLogGuildBank)
}
function shoutTracker () {
  if (!config.shoutTracker) return
  // COMMENT: Shout tracking
  bot.chatAddPattern(/^((\w+) \[(WC\d+)\] shouts: (.+))$/, 'chat:logShout')
  bot.on('chat:logShout', onLogShout)
}
// SECTION: behind the scenes functions that need to go into their own files
function onceLogin () {
  log.warn('Connected to Wynncraft.')
  // COMMENT: onWynncraft is set to true on startup
  universal.disconnected = false
  universal.onWynncraft = true
  universal.botUsername = bot.username
  // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(nowDate + `${config.firstConnectMessage}`)
  simplediscord.sendDate(config.statusChannel, `${config.firstConnectMessage}`)
}
function onLogin () {
  log.log('Login event fired.')
  clearInterval(universal.cancelCompassTimer)
  // COMMENT: onAWorld is used for whenever the WCA successfully logs into a world that isn't the hub
  universal.onAWorld = false
  // COMMENT: clear any compass checks
  // COMMENT: fallback to WC0 until the world is online
  universal.currentWorld = 'WC0'
  simplediscord.status(client)// COMMENT: check discord status
  log.warn('Connected.')
}
function onceSpawn () {
  // COMMENT: prismarine-viewer isn't needed for this bot but it looks cool
  // mineflayerViewer(bot, { viewDistance: 8, port: config.viewerPort, firstPerson: false })
  log.getChat()
  universal.bot = bot
}
async function onSpawn () {
  log.log('Spawn event fired.')
  // COMMENT: Wait for the chunks to load before checking
  await bot.waitForChunksToLoad()
  log.log('Chunks loaded...')
  if (universal.compassCheck === true) {
    await sleep(5000)
    wcabotlobby.compass()
  } else {
    await sleep(500)
    wcabotlobby.compass()
  }
}
function onWindowOpen (window) {
  wcabotlobby.onWindowOpen(window)
}
// let resourcePackSendListener
function onMessage (message) {
  const messageMotd = String(message.toMotd())
  const messageString = String(message.toString())
  // const messageAnsi = message.toAnsi()
  universal.realUsername = undefined
  // COMMENT: Exclude spam has many messages that clutter up your chat such as level up messages and other stuff like that
  const excludeActionbar = /(?:.+ \d+\/\d+ {4}(?:.*) {4}. \d+\/\d+)/
  const excludeSpam = /(?:.+ \d+\/\d+ {4}(?:.*) {4}. \d+\/\d+|.+ is now level .*|\[Info\] .+|As the sun rises, you feel a little bit safer...|\[\+\d+ Soul Points?\]|You still have \d+ unused skill points! Click with your compass to use them!)/
  if (excludeActionbar.test(messageString)) {
    return
  } else {
    const jsonString = JSON.stringify(message.json)
    log.verbose(jsonString)
    // COMMENT: Champion Nickname detector - used to get the real username of the bomb thrower and guild messages
    if (message.json.extra) {
      for (let i = 0; i < message.json.extra.length; i++) {
        if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
          universal.realUsername = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
          // nickUsername = message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[0]?.text
          // log.log(realUsername)
          // log.log(nickUsername)
        }
      }
    }
    if (excludeSpam.test(messageString)) {
      return
    } else {
      log.chat(message.toMotd())
    }
  }
  if (messageString === 'Loading Resource Pack...') {
    wacresourcepack.resourcePackAccept()
  } else {
    // COMMENT: Do some regex tests if the above don't work
    const compassCheckRegex = /(You're rejoining too quickly! Give us a moment to save your data\.|You are already connected to this server!|The server is full!)/
    const serverRestartRegex = /(The server is restarting in (10|\d) seconds?\.|Server restarting!|The server you were previously on went down, you have been connected to a fallback server|Server closed|Already connecting to this server!)/
    const bombRegex = /Want to thank (.+)\? Click here to thank them!/
    const botJoinRegex = /(\w+) has logged into server (\w+) as (?:a|an) (.+)/
    const guildMessageRegex = /§r§3\[(?:|§r§b(★|★★|★★★|★★★★|★★★★★))§r§3(.*)\]§r§b (.*)§r/
    const guildJoinRegex = /§r§b(\w+)§r§3 has logged into server §r§b(\w+)§r§3 as §r§ba (\w+)§r/
    if (compassCheckRegex.test(messageString)) {
      universal.compassCheck = true
    } else if (serverRestartRegex.test(messageString)) {
      // onKick('server_restart')
      wcabotlobby.hub('Server_Restart')
    } else if (bombRegex.test(messageString)) {
      // COMMENT: get off the server if an bomb is thrown - some people do item bomb parties
      universal.hubTimer = setTimeout(() => {
        log.log(`going to hub because bomb was thrown on ${universal.currentWorld}`)
        wcabotlobby.hub('Bomb')
      }, 2000)
    } else if (botJoinRegex.test(messageString)) {
      const matches = botJoinRegex.exec(messageString)
      if (matches[1] === universal.botUsername) {
        const [, username, world, wynnclass] = matches
        onBotJoin(username, world, wynnclass)
        // logGuildJoinToDiscord(message, username, world, wynnclass)
      }
    } else if (config.guildTracker === true) {
      if (guildMessageRegex.test(messageMotd)) {
        const matches = guildMessageRegex.exec(messageMotd)
        if (matches[2] === 'INFO') return
        let [fullMessage, guildRank, guildUsername, guildMessage] = matches
        if (universal.realUsername !== null) guildUsername = universal.realUsername
        wcaguild.guildMessage(fullMessage, guildRank, guildUsername, guildMessage)
      } else if (guildJoinRegex.test(messageMotd)) {
        const matches = guildJoinRegex.exec(messageMotd)
        if (matches[1] === bot.username) return
        let [fullMessage, guildUsername, guildWorld, guildClass] = matches
        if (universal.realUsername !== null) guildUsername = universal.realUsername
        wcaguild.guildJoin(fullMessage, guildUsername, guildWorld, guildClass)
      }
    }
  }
}
async function onBossBarUpdated (bossBar) {
  // COMMENT: get off the server if a bomb is in the bossbar
  const bombBarRegex = /(.+) from (.+) \[(\d+) min\]/
  const bossBarString = color.stripthes(bossBar.title.text)
  if (bombBarRegex.test(bossBarString)) {
    clearTimeout(universal.hubTimer)
    log.log(`going to hub because bomb was thrown on ${universal.currentWorld}`)
    wcabotlobby.hub('Bomb_BossBar')
  }
}
async function onLogBomb (message, username, bomb, world) {
  // COMMENT: Bomb tracking stuff
  const santitze = /(\[.+\] .+: .*|\[.* . .*\] .*|.* whispers to you: .*)/g
  const santitzeMessage = String(message)
  const timeLeft = null
  if (username === config.masterUser || universal.realUsername === config.masterUser) {
    // COMMENT: you PM the bot "Combat XP on WC1" and it will get a random player from that world and post the bomb to discord
    const randomPlayer = await fileCheck.getRandomPlayer(world)
    wcabomb.logBomb(message, randomPlayer, bomb, world, timeLeft)
  } else {
    // COMMENT: Santize input so that other people can't execute it via DMs
    if (santitze.test(santitzeMessage)) return
    // COMMENT: Use their real username if they are a Champion nick
    if (universal.realUsername !== null) username = universal.realUsername
    if (world == null) {
      clearTimeout(universal.hubTimer) // COMMENT: remove the timer if it is reported here
      // COMMENT: If world is somehow not defined, fallback to WC0 or WCA's current world
      world = universal.currentWorld
      log.log(`going to hub because bomb was thrown on ${world}`)
      wcabotlobby.hub('Bomb')
    }
    wcabomb.logBomb(message, username, bomb, world, timeLeft)
  }
}
async function onLogTerritory (territory, time, minutes) {
  // COMMENT: If this ever fires, Wynncraft changed their wars
  if (minutes === 'minute' || minutes === 'seconds' || minutes === 'second') return
  wcaguild.territory(territory, time)
}
function onLogGuildBank (message, username, deposit, amount, item, fromto, rank) {
  // COMMENT: Use their real username if they are a Champion nick
  if (universal.realUsername !== null) username = universal.realUsername
  wcaguild.guildBank(message, username, deposit, amount, item, fromto, rank)
}
function onLogShout (fullMessage, username, world, shoutMessage) {
  wcachat.logShout(fullMessage, username, world, shoutMessage)
}
function onBotJoin (username, world, wynnclass) {
  // COMMENT: Your now on a world - you have stopped loading resource pack lol
  universal.onAWorld = true
  universal.resourcePackLoading = false
  // COMMENT: Set the currentWorld to the current World instead of WC0
  universal.currentWorld = world
  log.log(`Online on ${world}`)
  // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.worldConnectMessage}`)
  simplediscord.sendTime(config.statusChannel, `${config.worldConnectMessage}`)
  simplediscord.status() // COMMENT: check discord status
}
async function runDiscord (message) {
  // COMMENT: if message doesn't start with the prefix, message author is WCA
  if (!message.content.startsWith(config.prefix) || message.author.bot) {
    return
  }
  const args = message.content.slice(config.prefix.length).trim().split(/ +/)
  const command = args.shift().toLowerCase()
  if (message.member.roles.cache.has(config.masterDiscordRole)) {
    // COMMENT: "Trusted Role Commands"
    // COMMENT: People with this role can use this command anywhere.
    switch (command) {
      case 'stop': {
        if (universal.onWynncraft === false) {
          message.channel.send(`Already offline, type ${config.prefix}start to connect tp Wynncraft.`)
          return
        }
        wcabotend.onKick('end_discord')
        log.warn(`WCA has quit game due to ${config.prefix}stop from discord`)
        message.channel.send(`WCA has quit game due to discord - type ${config.prefix}start to start it`)
        // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.stopWCA}`)
        simplediscord.sendTime(config.statusChannel, `${config.stopWCA}`)
        break
      }
      case 'exit': {
        log.warn('exiting via discord uwu')
        message.channel.send('exiting bot process')
        process.emit('SIGINT')
        break
      }
      case 'sudo': {
        const sudoMessage = args.join(' ')
        log.warn(`executed "${sudoMessage}"`)
        bot.chat(sudoMessage)
        message.channel.send(`executed \`${sudoMessage}\``)
        break
      }
      case 'tps': {
        const tps = bot.getTps()
        message.channel.send(`[${universal.currentWorld}] TPS: ${tps}`)
        break
      }
    }
  }
  if (message.member.roles.cache.has(config.masterDiscordRole) || message.member.roles.cache.has(config.trustedDiscordRole)) {
    switch (command) {
      // COMMENT: "Truwusted Role Commands"
      // COMMENT: People with this role can use this command anywhere.
      case 'start': {
        if (universal.onWynncraft === true) {
          message.channel.send(`Already online, type ${config.prefix}stop to quit Wynncraft.`)
          return
        }
        wcabotend.onRestart('discord')
        log.warn(`WCA has joined game - due to ${config.prefix}start from Discord.`)
        message.channel.send('starting WCA')
        // client.guilds.cache.get(config.guildid).channels.cache.get(config.statusChannel).send(now + `${config.startWCA}`)
        simplediscord.sendTime(config.statusChannel, `${config.startWCA}`)
        break
      }
      case 'hub': {
        wcabotlobby.hub('Discord')
        log.warn('going to hub...')
        message.channel.send('going to hub...')
        break
      }
      case 'compass': {
        if (universal.onAWorld === true) {
          message.channel.send('fail: already on a world')
          return
        }
        if (universal.onWynncraft === false) {
          message.channel.send('fail: offline')
          return
        }
        wcabotlobby.compass()
        log.warn('executing compass script')
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
  const cmd = discordCommands.commands[command]
  if (cmd && discordCommands.checkPermissions(cmd, message)) cmd.execute(message, args, { fileCheck, wcaguild })
}
function exitHandler () {
  bot.on('kicked', wcabotend.onKick)
  bot.on('end', wcabotend.onEnd)
  bot.on('error', function onErrorFunctionListener (err) { log.error(err) })
  process.once('SIGINT', function onSIGINT () {
    wcabotend.onKick('end_process')
  })
  process.once('SIGHUP', function onSIGHUP () {
    wcabotend.onKick('end_process')
  })
  process.once('SIGTERM', function onSIGTERM () {
    wcabotend.onKick('end_process')
  })
}
