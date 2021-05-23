// COMMENT: require cred and stuff first
const cred = require('./modules/config/cred.json')
process.env.DEBUG = cred.debug.logging
// SECTION: Mineflayer modules
const mineflayer = require('mineflayer')
// SECTION: Discord modules
const discord = require('discord.js')
const client = new discord.Client({ disableMentions: 'everyone' })

const repl = require('repl')
// SECTION: File system checks

// SECTION: all of the configs I need and wynncraft api
// COMMENT: "global" variables
const log = require('./modules/logging')
const mongos = require('./modules/mongodb/mongodb')
let startup = false
let config

// SECTION: end logging / begin Discord
async function start () {
  const fileCheck = require('./modules/fileCheck')
  await fileCheck.fileCheck()
  await mongos.start()
  client.login(cred.discordToken)
  config = require('./modules/config/config')
}
start()
exports.client = client

const universal = require('./modules/universal')
client.once('ready', async () => {
  const replOptions = {
    prompt: '$ ',
    input: process.stdin,
    output: process.stderr,
    breakEvalOnSigint: true
  }
  universal.repl = repl.start(replOptions)
  universal.repl.context.client = client
  // COMMENT: I am fancy and want the title to be WCA once it is logged into discord.
  process.title = cred.debug.title
  log.warn(`Logged into Discord as ${client.user.tag}`)
  // COMMENT: run this function whenever I recieve a discord message
  client.on('message', async message => {
    runDiscord(message)
  })
})
function login () {
  const version = config.droid.version
  const ip = process.argv[4] ? process.argv[4] : config.droid.ip
  const user = process.argv[2] ? process.argv[2] : cred.username
  const pass = process.argv[3] ? process.argv[3] : cred.password
  universal.droid = mineflayer.createBot({
    version: version,
    host: ip,
    username: user,
    password: pass,
    viewDistance: 'tiny',
    checkTimeoutInterval: 60000
  })
  initEvents()
}
exports.login = login

function initEvents () {
  const main = require('./main.js')
  if (startup === false) main.simplediscord.deleteOldBombs()
  startup = true
  universal.repl.context.main = main
  universal.repl.context.bot = universal.droid
  main.wca.api.WCStats.read()
  main.wca.api.onlinePlayers.get()
  clearInterval(universal.timer.apiInterval)
  main.universal.timer.apiInterval = setInterval(() => {
    main.wca.api.onlinePlayers.get()
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
    main.wca.events.onChat(message, pos)
  })
  main.universal.droid.on('actionBar', (message) => {
    main.wca.events.onActionBar(message)
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
  main.universal.droid.on('error', function onErrorFunctionListener (err) { log.error(err) })
}

async function runDiscord (message) {
  const discordCommands = require('./modules/discord')
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
          message.channel.send('uwu')
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
  const main = require('./main.js')
  main.wca.onEnd.onKick('end_process')
})
process.once('SIGHUP', function onSIGHUP () {
  const main = require('./main.js')
  main.wca.onEnd.onKick('end_process')
})
process.once('SIGTERM', function onSIGTERM () {
  const main = require('./main.js')
  main.wca.onEnd.onKick('end_process')
})
