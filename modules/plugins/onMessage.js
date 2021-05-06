const onMessage = {}
const config = require('../config/config.js')
const color = require('../colors.js')
const wcaGuild = require('../guild.js')
const wcaCore = require('./core.js')
const wcaResourcePack = require('./resourcepack.js')
const universal = require('../universal.js')
const log = require('../logging.js')
const wcaBomb = require('../bomb.js')
const wcaHousing = require('../plugins/housing.js')
const housing = require('../plugins/housing.js')
const chat = require('../chat.js')

onMessage.onMessage = function (message, pos, messageString, messageMotd, messageAnsi) {
  universal.info.realIGN = undefined
  // COMMENT: Exclude spam has many messages that clutter up your chat such as level up messages and other stuff like that
  chat.logChat(message, messageString, pos)
  // COMMENT: I do not want to check for any messages from the actionbar
  if (messageString === 'Loading Resource Pack...') {
    wcaResourcePack.resourcePackAccept()
  } else {
    // COMMENT: Regex for messages in hub that do fire the login event.
    const compassCheckRegex = /(You're rejoining too quickly! Give us a moment to save your data\.|Already connecting to this server!)/
    // COMMENT: Regex for messages in hub that don't fire the login event.
    const compassCheckErrors = /(Failed to send you to target server\. So we're sending you back\.|Could not connect to a default or fallback server, please try again later: io\.netty\.channel\..*|You are already connected to this server!|The server is full!|.* left the game.|<\w+> .*)/
    // COMMENT: Regex for server restarts.
    const serverRestartRegex = /(The server is restarting in (1|30) (minute|second)s?\.|Server restarting!|The server you were previously on went down, you have been connected to a fallback server|Server closed|\[Proxy\] Lost connection to server\.)/
    // COMMENT: Regex for bombs.
    const bombThankRegex = /Want to thank (.+)\? Click here to thank them!/
    // COMMENT: Regex for joining a world.
    const worldJoinRegex = /§r§a(?:|§r§a§o)(\w+)§r§2 has logged into server §r§a(WC\d+)§r§2 as §r§a(?:a|an) (\w+)§r/
    const worldSwitchRegex = /Saving your player data before switching to (WC\d+).../
    // COMMENT: Soul Point Check.
    if (compassCheckRegex.test(messageString)) {
      universal.state.compassCheck = true
      // wcacore.compass()
    } else if (compassCheckErrors.test(messageString)) {
      wcaCore.lobbyError('LobbyError')
    } else if (serverRestartRegex.test(messageString)) {
      // onKick('server_restart')
      wcaCore.switch('Server_Restart')
    } else if (bombThankRegex.test(messageString)) {
      // COMMENT: get off the server if an bomb is thrown - some people do item bomb parties
      wcaBomb.bombThanks()
    } else if (worldJoinRegex.test(messageMotd)) {
      const matches = worldJoinRegex.exec(messageMotd)
      if (matches[1] === universal.info.droidIGN || matches[1] === universal.info.droidNickedIGN) {
        const [, username, world, wynnclass] = matches
        wcaCore.onWorldJoin(username, world, wynnclass)
        // logGuildJoinToDiscord(message, username, world, wynnclass)
      }
    } else if (worldSwitchRegex.test(messageString)) {
      const matches = worldSwitchRegex.exec(messageString)
      const [, world] = matches
      universal.currentWorld = world
      universal.state.serverSwitch = true
    } else if (config.state.guildTracker || config.state.shoutTracker || config.state.bombTracker || config.state.housingTracker) {
      if (config.state.guildTracker) {
        // COMMENT: Regex for guild message.
        const guildMessageRegex = /§r§3\[(?:|§r§b(★|★★|★★★|★★★★|★★★★★))§r§3(.*?)\]§r§b (.*)§r/
        // COMMENT: Regex for guild members joining.
        const guildJoinRegex = /§r§b(.+)§r§3 has logged into server §r§b(\w+)§r§3 as §r§ba (\w+)§r/
        // COMMENT: Regex for guild bank.
        const guildBankRegex = /\[INFO\] (.+?) (deposited|withdrew) (\d+x) (.+?) (from|to) the Guild Bank \((.+?)\)/
        // COMMENT: Regex for territory tracking.
        const territoryRegex = /\[WAR\] The war for (.+) will start in (\d+) (.+)\./
        if (guildMessageRegex.test(messageMotd)) {
          const matches = guildMessageRegex.exec(messageMotd)
          if (matches[2] === 'INFO') return
          let [, guildRank, guildUsername, guildMessage] = matches
          if (universal.info.realIGN != null) guildUsername = universal.info.realIGN
          wcaGuild.guildMessage(messageString, guildRank, guildUsername, guildMessage)
        } else if (guildJoinRegex.test(messageMotd)) {
          const matches = guildJoinRegex.exec(messageMotd)
          if (matches[1] === universal.droid.username) return
          let [, guildUsername, guildWorld, guildClass] = matches
          if (universal.info.realIGN != null) guildUsername = universal.info.realIGN
          wcaGuild.guildJoin(messageString, guildUsername, guildWorld, guildClass)
        } else if (guildBankRegex.test(messageString)) {
          const matches = guildBankRegex.exec(messageString)
          let [, shoutUsername, deposit, amount, item, fromto, guildRank] = matches
          if (universal.info.realIGN != null) shoutUsername = universal.info.realIGN
          wcaGuild.guildBank(messageString, shoutUsername, deposit, amount, item, fromto, guildRank)
        } else if (territoryRegex.test(messageString)) {
          const matches = territoryRegex.exec(messageString)
          const [, territory, time, minutes] = matches
          if (minutes === 'minute' || minutes === 'seconds' || minutes === 'second') return
          wcaGuild.territory(territory, time)
        }
      }
      if (config.state.shoutTracker) {
        // COMMENT: Regex for shout messages
        const shoutMessageRegex = /(\w+) \[(WC\d+)\] shouts: (.+)/
        if (shoutMessageRegex.test(messageString)) {
          const matches = shoutMessageRegex.exec(messageString)
          const [, username, world, shoutMessage] = matches
          chat.logShout(messageString, username, world, shoutMessage)
        }
      }
      if (config.state.bombTracker) {
        // COMMENT: Legacy regexes, motd is better because spoofing is impossible
        // const bombBellRegex = /\[Bomb Bell\] (.+) has thrown a (.+) Bomb on (WC\d+)/
        // const bombThrownRegex = /(\w+) has thrown a (.+) Bomb!.*/
        // const bombPMRegex = /\[(\w+) . (?:.+)\] (.+) on (WC\d+) /
        // const sanatizeMessage = /(\[.+\] .+: .*|\[.* . .*\] .*)/
        const bombBellRegex = /§r§e\[Bomb Bell\] §r§f(\w+?) §r§7has thrown (?:a|an) §r§f(.+?) Bomb §r§7on §r§f(WC\d+)§r/
        const bombBellNickedRegex = /§r§e\[Bomb Bell\] §r§f§r§f§r§f§o(.+?)§r§f §r§7has thrown (?:a|an) §r§f(.+?) Bomb §r§7on §r§f(WC\d+)§r/
        const bombThrownRegex = /§r§b(\w+?)§r§3 has thrown (?:a|an) §r§b(.+?) Bomb§r§3!.*/
        const bombThrownNickedRegex = /§r§b§r§b§o(.+?)§r§3 has thrown (?:a|an) §r§b(.+?) Bomb§r§3!.*/
        if (bombBellNickedRegex.test(messageMotd)) {
          const matches = bombBellNickedRegex.exec(messageMotd)
          let [, username, bomb, world] = matches
          // COMMENT: Use their real username if they are a Champion nick
          if (universal.info.realIGN != null) username = universal.info.realIGN
          wcaBomb.logBomb(messageString, username, bomb, world)
        } else if (bombBellRegex.test(messageMotd)) {
          const matches = bombBellRegex.exec(messageMotd)
          const [, username, bomb, world] = matches
          wcaBomb.logBomb(messageString, username, bomb, world)
        } else if (bombThrownNickedRegex.test(messageMotd)) {
          const matches = bombThrownNickedRegex.exec(messageMotd)
          let [, username, bomb] = matches
          // COMMENT: Use their real username if they are a Champion nick
          if (universal.info.realIGN != null) username = universal.info.realIGN
          clearTimeout(universal.timer.hubTimer) // COMMENT: remove the timer if it is reported here
          log.log(`going to hub because bomb was thrown on ${universal.info.currentWorld}`)
          wcaBomb.logBomb(messageString, username, bomb, universal.info.currentWorld)
          // COMMENT: go to hub
          if (config.state.ignoreBombs) return
          wcaCore.hub('Bomb')
        } else if (bombThrownRegex.test(messageMotd)) {
          const matches = bombThrownRegex.exec(messageMotd)
          const [, username, bomb] = matches
          clearTimeout(universal.timer.hubTimer) // COMMENT: remove the timer if it is reported here
          log.log(`going to hub because bomb was thrown on ${universal.info.currentWorld}`)
          wcaBomb.logBomb(messageString, username, bomb, universal.info.currentWorld)
          // COMMENT: go to hub
          if (config.state.ignoreBombs) return
          wcaCore.hub('Bomb')
        }
      }
      if (config.state.housingTracker) {
        const housingJoinRegex = /You have flown to your housing island\./
        const housingLeaveRegex = /(You have flown to your original position\.|You have left the house\.)/
        const housingPlayerJoinRegex = /(\w+) is visiting this island. Say hi!/
        const housingPlayerLeaveRegex = /(\w+) left this island\./
        const housingPublicRegex = /Your house is now (\w+),.*/
        if (housingJoinRegex.test(messageString)) {
          wcaHousing.join()
        } else if (housingLeaveRegex.test(messageString)) {
          wcaHousing.leave()
        } else if (housingPlayerJoinRegex.test(messageString)) {
          const matches = housingPlayerJoinRegex.exec(messageString)
          const [, player] = matches
          housing.playerJoin(player)
        } else if (housingPlayerLeaveRegex.test(messageString)) {
          const matches = housingPlayerLeaveRegex.exec(messageString)
          const [, player] = matches
          housing.playerLeave(player)
        } else if (housingPublicRegex.test(messageString)) {
          const matches = housingPublicRegex.exec(messageString)
          const [, state] = matches
          housing.housePublic(state)
        }
      }
    }
  }
}
onMessage.onActionBar = function (message, pos, messageString, messageMotd, messageAnsi) {
  // ❤ (-?\d+)\/(\d+)    (.*)    ✺ (-?\d+)\/(\d+)
  // ❤ 69/69    -69 W 69    ✺ 20/20
  /*
  const healthRegex = /❤ (-?\d+)\/(\d+) {4}(.*) {4}✺ (-?\d+)\/(\d+)/
  if (healthRegex.test(messageString)) {
    const matches = healthRegex.exec(messageString)
    const [, health, healthMax, , mana, manaMax] = matches
    log.log(`${health}/${healthMax} | ${mana}/${manaMax}`)
  }
  */
  // log.log(`${messageString} | ${pos}`)
}
onMessage.onBossBarUpdated = function (bossBar) {
  // COMMENT: get off the server if a bomb is in the bossbar
  const bombBarRegex = /(.+?) from (.+?) \[(\d+) min\]/
  const bossBarString = color.stripthes(bossBar.title.text)
  if (bombBarRegex.test(bossBarString)) {
    const matches = bombBarRegex.exec(bossBarString)
    const [, , , duration] = matches
    log.log(duration)
    wcaBomb.bossBarBomb(duration)
  }
}
module.exports = onMessage
