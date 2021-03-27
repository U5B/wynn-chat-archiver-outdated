// const config = require('./config/config.json')
const log = require('./logging.js')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const api = {}

api.onlinePlayers = function () {
  axios.get('https://athena.wynntils.com/cache/get/serverList')
    .then(request => {
      const file = JSON.stringify(request.data, null, 2)
      fs.writeFile(path.join(__dirname, '/api/onlinePlayers.json'), file, err => {
        if (err) {
          log.error(err)
        }
      })
    })
    .catch(error => { //  Handle errors
      log.log(error)
    })
}
module.exports = api
