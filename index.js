process.env.DEBUG = 'DEBUG,CHAT,INFO,ERROR,WARN,VERBOSE,LOG'
// SECTION: Mineflayer modules
const mineflayer = require('mineflayer')
// SECTION: Discord modules
const discord = require('discord.js')
const client = new discord.Client({ disableMentions: 'everyone' })
const sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
exports.sleep = sleep

// SECTION: File system checks
const fileCheck = require('./modules/fileCheck')
fileCheck.fileCheck()
// COMMENT: other files

// SECTION: all of the configs I need and wynncraft api
const config = require('./modules/config/config.js')
const cred = require('./modules/config/cred.json')
// COMMENT: "global" variables
const log = require('./modules/logging')
const universal = require('./modules/universal')

// SECTION: end logging / begin Discord
client.login(cred.discordToken)
exports.client = client

client.once('ready', async () => {
  // COMMENT: I am fancy and want the title to be WCA once it is logged into discord.
  process.title = config.debug.title ? config.debug.title : 'Wynn Chat Archive'
  log.warn(`Logged into Discord as ${client.user.tag}`)
  await client.guilds.cache.get(config.discord.guildid).channels.cache.get(config.discord.bomb.channel).bulkDelete(100) // COMMENT: how do you delete specific messages after a certain time
  login()
  // COMMENT: run this function whenever I recieve a discord message
  client.on('message', async message => {
    runDiscord(message)
  })
})
function login () {
  const version = config.droid.version
  const ip = process.argv[4] ? process.argv[4] : config.droid.ip
  const port = process.argv[5] ? process.argv[5] : config.droid.port
  const user = process.argv[2] ? process.argv[2] : cred.username
  const pass = process.argv[3] ? process.argv[3] : cred.password
  universal.droid = mineflayer.createBot({
    version: version,
    host: ip,
    port: port,
    username: user,
    password: pass,
    viewDistance: 'tiny',
    checkTimeoutInterval: 60000
  })
  initEvents()
}
exports.login = login

const main = require('./main.js')
function initEvents () {
  main.wca.api.WCStats.read()
  main.wca.api.onlinePlayers()
  clearInterval(universal.timer.apiInterval)
  main.universal.timer.apiInterval = setInterval(() => {
    main.wca.api.onlinePlayers()
  }, 30000)
  main.universal.droid.once('spawn', () => {
    main.wca.events.onceSpawn()
  })
  main.universal.droid.on('spawn', () => {
    main.wca.events.onSpawn()
  })
  main.universal.droid.once('login', () => {
    main.wca.events.onceLogin()
  })
  main.universal.droid.on('login', () => {
    main.wca.events.onLogin()
  })
  main.universal.droid.on('windowOpen', (window) => {
    main.wca.events.onWindowOpen(window)
  })
  // COMMENT: This is special regexes for logging and when I can't detect special chats via chatAddPattern
  main.universal.droid.on('message', (message, pos) => {
    main.wca.events.onMessage(message, pos)
  })
  main.universal.droid.on('bossBarUpdated', (bossBar) => {
    main.wca.events.onBossBarUpdated(bossBar)
  })
  main.universal.droid.on('kicked', (reason, loggedIn) => {
    main.wca.onEnd.onKick(reason, loggedIn)
  })
  main.universal.droid.on('end', (reason) => {
    main.wca.onEnd.onEnd(reason)
  })
  universal.droid.on('error', function onErrorFunctionListener (err) { log.error(err) })
}

const discordCommands = require('./modules/discord')
async function runDiscord (message) {
  // COMMENT: if message doesn't start with the prefix, message author is WCA
  if (message.author.bot) return
  if (message.content.startsWith(config.discord.prefix)) {
    // COMMENT: Discord commands
    const args = message.content.slice(String(config.discord.prefix).length).trim().split(/ +/)
    const command = args.shift().toLowerCase()
    const cmd = discordCommands.commands[command]
    if (cmd && discordCommands.checkPermissions(cmd, message)) {
      cmd.execute(message, args, {})
    } else {
      switch (command) {
        case 'test': {
          message.channel.send('wuwuhy')
          break
        }
        default: {
          message.channel.send('no permission / unknown command')
          break
        }
      }
    }
  }
}

process.once('SIGINT', function onSIGINT () {
  main.wca.onEnd.onKick('end_process')
})
process.once('SIGHUP', function onSIGHUP () {
  main.wca.onEnd.onKick('end_process')
})
process.once('SIGTERM', function onSIGTERM () {
  main.wca.onEnd.onKick('end_process')
})
