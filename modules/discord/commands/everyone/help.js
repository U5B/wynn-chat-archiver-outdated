const config = require('../../../config/config.js')
module.exports = {
  name: 'help',
  description: 'returns this help message',
  permissionRoles: [],
  allowedRoles: [config.discord.admin.masterRole, config.discord.admin.trustedRole],
  allowedChannels: [config.discord.log.commandChannel],
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
    sudo = eval but chat`

    const availableRoles = this.allowedRoles.map(role => message.member.roles.cache.has(role))

    message.channel.send(`${publicMessage}${availableRoles[1] ? `\n${truwustedMessage}` : ''}${availableRoles[0] ? `\n${truwustedMessage}\n${trustedMessage}` : ''}`)
  }
}
