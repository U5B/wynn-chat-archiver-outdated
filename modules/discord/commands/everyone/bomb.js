const config = require('../../../config/config.js')
const main = require('../../../../main.js')
module.exports = {
  name: 'bomb',
  description: 'get bomb stats of a specific world',
  permissionRoles: [],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
  execute (message, args, customs) {
    switch (args[0]) {
      case 'wc': {
        const answer = main.files.getBombStats(args[1], args[2])
        if (answer === null) return message.channel.send('Internal error occurred')
        message.channel.send(answer)
        break
      }
      case 'lb': {
        let answer
        switch (args[1]) {
          case undefined: {
            const lbCombatXP = main.files.getBombLeaderboard('Combat_XP')
            const lbDungeon = main.files.getBombLeaderboard('Dungeon')
            const lbLoot = main.files.getBombLeaderboard('Loot')
            const lbProfessionSpeed = main.files.getBombLeaderboard('Profession_Speed')
            const lbProfessionXP = main.files.getBombLeaderboard('Profession_XP')
            if (lbCombatXP || lbDungeon || lbLoot || lbProfessionSpeed || lbProfessionSpeed) {
              message.channel.send(`**Combat_XP Leaderboard:**\`\`\`${lbCombatXP}\`\`\`**Dungeon Leaderboard:**\`\`\`${lbDungeon}\`\`\`**Loot Leaderboard:**\`\`\`${lbLoot}\`\`\`**Profession_Speed Leaderboard:**\`\`\`${lbProfessionSpeed}\`\`\`**Profession_XP Leaderboard:**\`\`\`${lbProfessionXP}\`\`\``)
            }
            break
          }
          default: {
            answer = main.files.getBombLeaderboard(args[1])
            if (answer == null) {
              message.channel.send('Internal error occurred')
            } else {
              message.channel.send(`**${args[1]} Leaderboard:**\n\`\`\`${answer}\`\`\``)
            }
            break
          }
        }
        break
      }
      default: {
        message.channel.send(`Incorrect format: "${config.discord.prefix}bomb lb <Combat_XP>" or "${config.discord.prefix}bomb wc <WC1> [Combat_XP]"`)
        break
      }
    }
    /*
    if (!args.length) {
      message.channel.send(`Incorrect format: "${config.discord.prefix}bomb lb <Combat_XP>" or "${config.discord.prefix}bomb wc <WC1> [Combat_XP]"`)
    } else if (args[0] === 'wc') {
      const answer = main.files.getBombStats(args[1], args[2])
      if (answer === null) {
        message.channel.send('Internal error occurred')
        return
      }
      message.channel.send(answer)
    } else if (args[0] === 'lb') {
      let answer
      if (args[1]) {
        answer = main.files.getBombLeaderboard(args[1])
        if (answer == null) {
          message.channel.send('Internal error occurred')
        } else {
          message.channel.send(`**${args[1]} Leaderboard:**\n\`\`\`${answer}\`\`\``)
        }
      } else {
        const lbCombatXP = main.files.getBombLeaderboard('Combat_XP')
        const lbDungeon = main.files.getBombLeaderboard('Dungeon')
        const lbLoot = main.files.getBombLeaderboard('Loot')
        const lbProfessionSpeed = main.files.getBombLeaderboard('Profession_Speed')
        const lbProfessionXP = main.files.getBombLeaderboard('Profession_XP')
        if (lbCombatXP || lbDungeon || lbLoot || lbProfessionSpeed || lbProfessionSpeed) {
          message.channel.send(`**Combat_XP Leaderboard:**\`\`\`${lbCombatXP}\`\`\`**Dungeon Leaderboard:**\`\`\`${lbDungeon}\`\`\`**Loot Leaderboard:**\`\`\`${lbLoot}\`\`\`**Profession_Speed Leaderboard:**\`\`\`${lbProfessionSpeed}\`\`\`**Profession_XP Leaderboard:**\`\`\`${lbProfessionXP}\`\`\``)
        }
      }
    } else {
      message.channel.send('Internal error occurred')
    }
  */
  }
}
