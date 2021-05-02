// const config = require('./config/config.json')
const universal = require('./universal.js')
const log = require('./logging.js')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const api = {}

api.onlinePlayers = {
  get: async function () {
    await axios.get('https://athena.wynntils.com/cache/get/serverList')
      .then(request => {
        universal.api.onlinePlayers = request.data.servers
        const file = JSON.stringify(request.data, null, 2)
        fs.writeFile(path.join(__dirname, '/api/onlinePlayers.json'), file, err => {
          if (err) {
            log.verbose(err)
          }
        })
      })
      .catch(error => {
        log.verbose(error)
      })
  },
  read: function () {
    universal.api.onlinePlayers = JSON.parse(fs.readFileSync(path.join(__dirname, '/api/onlinePlayers.json'))).servers
  }
}
api.WCStats = {
  read: function () {
    universal.api.WCStats = JSON.parse(fs.readFileSync(path.join(__dirname, '/api/WCStats.json')))
  },
  write: function () {
    fs.writeFileSync(path.join(__dirname, '/api/WCStats.json'), JSON.stringify(universal.api.WCStats, null, 2))
  }
}
module.exports = api
