const fs = require('fs')
const axios = require('axios')
const path = require('path')
const filesCheck = {}
filesCheck.fileCheck = async function filesExist () {
  fs.mkdirSync(path.join(__dirname, '/api/'), { recursive: true })
  fs.mkdirSync(path.join(__dirname, '/config/'), { recursive: true })
  fs.mkdirSync(path.join(__dirname, '../logs/chat'), { recursive: true })
  fs.mkdirSync(path.join(__dirname, '../logs/debug'), { recursive: true })
  if (!fs.existsSync(path.join(__dirname, '/api/territorylocations.json'))) {
    axios.get('https://api.wynncraft.com/public_api.php?action=territoryList')
      .then(r => {
        const file = JSON.stringify(r.data, null, 2)
        fs.writeFileSync(path.join(__dirname, '/api/territorylocations.json'), file)
      })
      .catch(error => { //  Handle errors
        console.error(error)
      })
  }
  if (!fs.existsSync(path.join(__dirname, '/api/WCStats.json'))) {
    const data = {}
    for (let i = 0; i < 100; i++) {
      data[`WC${i}`] = {
        'Combat XP': 0,
        Dungeon: 0,
        Loot: 0,
        'Profession Speed': 0,
        'Profession XP': 0
      }
    }
    const jsonString = JSON.stringify(data, null, 2)
    fs.writeFileSync(path.join(__dirname, '/api/WCStats.json'), jsonString)
  }
  if (!fs.existsSync(path.join(__dirname, '/config/config.json')) || !fs.existsSync(path.join(__dirname, '/config/cred.json'))) throw new Error('Missing config files! Put config.json & cred.json inside ./modules/config/')
}
module.exports = filesCheck
