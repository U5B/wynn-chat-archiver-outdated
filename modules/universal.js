module.exports = {
  api: {
    onlinePlayers: undefined,
    WCStats: undefined,
    bombArray: ['YT', 'TEST']
  },
  droid: undefined,
  info: {
    currentWorld: 'WC0',
    droidIGN: undefined,
    realIGN: undefined,
    droidNickedIGN: undefined
  },
  state: {
    housing: {
      online: false,
      public: false,
      playerList: []
    },
    disconnected: false,
    onlineWynn: false,
    onlineWorld: false,
    compassCheck: false,
    serverSwitch: false
  },
  timer: {
    cancelLoginTimer: undefined,
    cancelCompassTimer: undefined,
    hubTimer: undefined,
    apiInterval: undefined,
    discordStatusInterval: undefined
  },
  sleep: ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
}
