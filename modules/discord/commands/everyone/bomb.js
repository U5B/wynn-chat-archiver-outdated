const config = require('../../../config/config.json')
module.exports = {
  name: 'bomb',
  description: 'get bomb stats of a specific world',
  permissionRoles: [],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message, args, customs) {
    if (!args.length) {
      message.channel.send(`Incorrect format: "${config.prefix}bomb lb <Combat_XP>" or "${config.prefix}bomb wc <WC1> [Combat_XP]"`)
    } else if (args[0] === 'wc') {
      const answer = customs.fileCheck.getBombStats(args[1], args[2])
      if (answer === null) {
        message.channel.send('Internal error occurred')
        return
      }
      message.channel.send(answer)
    } else if (args[0] === 'lb') {
      let answer
      if (args[1]) {
        answer = customs.fileCheck.getBombLeaderboard(args[1])
        if (answer == null) {
          message.channel.send('Internal error occurred')
        } else {
          message.channel.send(`**${args[1]} Leaderboard:**\n\`\`\`${answer}\`\`\``)
        }
      } else {
        const lbCombatXP = customs.fileCheck.getBombLeaderboard('Combat_XP')
        const lbDungeon = customs.fileCheck.getBombLeaderboard('Dungeon')
        const lbLoot = customs.fileCheck.getBombLeaderboard('Loot')
        const lbProfessionSpeed = customs.fileCheck.getBombLeaderboard('Profession_Speed')
        const lbProfessionXP = customs.fileCheck.getBombLeaderboard('Profession_XP')
        if (lbCombatXP || lbDungeon || lbLoot || lbProfessionSpeed || lbProfessionSpeed) {
          message.channel.send(`**Combat_XP Leaderboard:**\`\`\`${lbCombatXP}\`\`\`**Dungeon Leaderboard:**\`\`\`${lbDungeon}\`\`\`**Loot Leaderboard:**\`\`\`${lbLoot}\`\`\`**Profession_Speed Leaderboard:**\`\`\`${lbProfessionSpeed}\`\`\`**Profession_XP Leaderboard:**\`\`\`${lbProfessionXP}\`\`\``)
        }
      }
    } else {
      message.channel.send('Internal error occurred')
    }
  }
}
