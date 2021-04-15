const config = require('../../../config/config.json')

module.exports = {
  name: 'help',
  description: 'returns this help message',
  permissionRoles: [],
  allowedRoles: [config.masterDiscordRole, config.trustedDiscordRole],
  allowedChannels: [config.commandChannel],
  execute (message) {
    const publicMessage = `Everyone:
    null = returns null
    help = returns this help message
    random = returns a random player on that specific world
    bomb = get bomb stats of a specific world`
    const truwustedMessage = `Truwusted:
    start = starts the WCA
    hub = go to hub and join a new world
    compass = force compass check
    stream = toggle stream mode`
    const trustedMessage = `Trusted:
    stop = stops the WCA
    exit = panic command to stop everything
    sudo = sudo the bot to do something in chat / make sure you put a slash before any commands`

    const availableRoles = this.allowedRoles.map(role => message.member.roles.cache.has(role))

    message.channel.send(`${publicMessage}${availableRoles[1] ? `\n${truwustedMessage}` : ''}${availableRoles[0] ? `\n${truwustedMessage}\n${trustedMessage}` : ''}`)
  }
}
