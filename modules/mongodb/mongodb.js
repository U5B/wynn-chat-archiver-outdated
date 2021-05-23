const { MongoClient } = require('mongodb')
const mongodefaults = require('./mongodefaults')
const cred = require('../config/cred.json')
const log = require('../logging')
const universal = require('../universal')
const fs = require('fs')
const path = require('path')

// Replace the uri string with your MongoDB deployment's connection string.
const uri = cred.mongodb
let mongoEnv = '_prod'
let env
let dbConfig
let dbData
const mongos = {}
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true })

mongos.start = async function start () {
  if (cred.debug.state) mongoEnv = '_dev'
  log.warn('Connecting to database')
  await client.connect() // COMMENT: connect to database
    .catch(err => {
      console.log(err)
      client.close()
    })
  env = client.db(mongoEnv)
  await startupChecks() // COMMENT: perform some startup checks such as creating the collections if they don't exist
  await fetchConfig()
  await fetchData()
  /*
  try {
    await client.connect()
    const cursor = await client.db('_dev').collection('config').find({})
    const values = await cursor.toArray()
    await cursor.close()
    console.log(values[0].discord.default)
  } catch (error) {
    console.log(error)
    // Ensures that the client will close when you error
    await client.close()
  }
  */
  log.warn('Connected to database')
  return true
}
mongos.stop = async function () {

}
async function startupChecks () {
  const envCheck = await env.listCollections({}, { nameOnly: true }).toArray()
  if (envCheck.length === 0) {
    await firstTimeStartup() // Only run this if there is nothing in the database
  } else {
    const configCollection = await env.listCollections({ name: 'config' }).ok
    const dataCollection = await env.listCollections({ name: 'data' }).ok
    if (configCollection !== 1) { // COMMENT: check if the configs exist
      dbConfig = env.collection('config')
      const discordData = await dbConfig.countDocuments({ config: 'discord' }, { limit: 1 })
      const droidData = await dbConfig.countDocuments({ config: 'droid' }, { limit: 1 })
      if (discordData === 0) generateConfig(dbConfig, 'discord')
      if (droidData === 0) generateConfig(dbConfig, 'droid')
    }
    if (dataCollection !== 1) { // COMMENT: check if the collection exists
      dbData = env.collection('data')
      const bombsData = await dbData.countDocuments({ data: 'bombs' }, { limit: 1 })
      if (bombsData === 0) {
        await generateBombData(dbData)
      }
    }
  }
  return true
}
async function firstTimeStartup () {
  dbConfig = await env.createCollection('config')
  await generateConfig(dbConfig, 'discord')
  await generateConfig(dbConfig, 'droid')
  dbData = await env.createCollection('data')
  await generateBombData(dbData)
}
async function generateConfig (collection, document) {
  const data = mongodefaults.config[document]
  await collection.insertOne(data)
  return true
}
async function generateBombData (collection) {
  const bombsDoc = mongodefaults.data.bombs
  if (fs.existsSync(path.join(__dirname, '../api/WCStats.json'))) {
    bombsDoc.bombs = JSON.parse(fs.readFileSync(path.join(__dirname, '../api/WCStats.json')))
  }
  await collection.insertOne(bombsDoc)
  return true
}
async function fetchConfig () {
  const discordData = await dbConfig.find({ config: 'discord' }).toArray()
  universal.mongodb.config.discord = discordData[0].discord
  const droidData = await dbConfig.find({ config: 'droid' }).toArray()
  universal.mongodb.config.droid = droidData[0].droid
  return true
}
async function fetchData () {
  const bombsData = await dbData.find({ data: 'bombs' }).toArray()
  universal.mongodb.data.bombs = bombsData[0].bombs
  return true
}
module.exports = mongos
