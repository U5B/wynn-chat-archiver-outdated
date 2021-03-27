module.exports = {
  commands: {
    bomb: require('./bomb'),
    help: require('./help'),
    null: require('./null'),
    random: require('./random'),
    territory: require('./territory')
  },
  checkPermissions: (cmd, msg) => {
    const permissions = cmd.permissionRoles
    const channels = cmd.allowedChannels
    const roles = cmd.allowedRoles
    const hasAnyRole = () => {
      if (roles.some(role => msg.member.roles.cache.has(role))) return true
      return false
    }
    const hasPermission = () => {
      if (permissions.length === 0 || permissions.some(role => msg.member.roles.cache.has(role))) return true
      return false
    }
    // COMMENT: check for correct channel
    if (channels && channels.includes(msg.channel.id) && hasPermission()) return true
    // COMMENT: check if the role bypasses the channel
    if (roles && hasAnyRole() && hasPermission()) return true
    // COMMENT: if no channels or roles, just return as true
    if (!channels && !roles && hasPermission()) return true
    // COMMENT: otherwise return false
    return false
  }
}
