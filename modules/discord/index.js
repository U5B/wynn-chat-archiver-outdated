// COMMENT: Thanks Moondarker / Unknwn#1537 for rewriting most of my discord commands
module.exports = {
  commands: {
    bomb: require('./commands/everyone/bomb'),
    help: require('./commands/everyone/help'),
    null: require('./commands/everyone/null'),
    random: require('./commands/everyone/random'),
    territory: require('./commands/everyone/territory'),
    // COMMENT: trusted role
    compass: require('./commands/trusted/compass'),
    hub: require('./commands/trusted/hub'),
    switch: require('./commands/trusted/switch'),
    start: require('./commands/trusted/start'),
    stream: require('./commands/trusted/stream'),
    housing: require('./commands/trusted/housing'),
    // COMMENT: master role
    stop: require('./commands/master/stop'),
    exit: require('./commands/master/exit'),
    sudo: require('./commands/master/sudo'),
    c: require('./commands/master/c')
  },
  checkPermissions: (cmd, msg) => {
    const permissions = cmd.permissionRoles
    const channels = cmd.allowedChannels
    const roles = cmd.allowedRoles
    // COMMENT: check if you have a role
    const hasAnyRole = () => {
      if (roles.some(role => msg.member.roles.cache.has(role))) return true
      return false
    }
    // COMMENT: check if you have permission
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
