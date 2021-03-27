module.exports = {
  commands: {
    bomb: require('./bomb'),
    help: require('./help'),
    null: require('./null'),
    random: require('./random'),
    territory: require('./territory')
  },
  checkPermissions: (cmd, msg) => {
    const channels = cmd.allowedChannels
    const roles = cmd.allowedRoles

    const hasAnyRole = () => {
      if (roles.some(role => msg.member.roles.cache.has(role))) return true
      return false
    }

    if (channels && channels.includes(msg.channel.id)) return true
    if (roles && hasAnyRole()) return true
    if (!channels && !roles) return true

    return false
  }
}
