const storage = require('../storage')


const getPreferences = (guildId, userId) => {
   return storage.get(`${guildId}.${userId}`).value()
}


module.exports = getPreferences
