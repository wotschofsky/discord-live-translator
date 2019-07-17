const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')


const adapter = new Memory()
const db = low(adapter)

db.setState({})
db.write()


module.exports = db
