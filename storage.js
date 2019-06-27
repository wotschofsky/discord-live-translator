const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const FileSync = require('lowdb/adapters/FileSync')


// const adapter = new Memory()
const adapter = new FileSync('storage.json')
const db = low(adapter)


module.exports = db
