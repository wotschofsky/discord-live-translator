const getPreferences = require('../utils/getPreferences')
const langData = require('../langData.json')


const statusCommand = (client, message, command) => {
   let prefs = getPreferences(message.guild.id, message.author.id)
   if(!prefs) {
      message.reply('you currently have **not activated** live translation! :cry:')
   } else {
      message.reply(`you are currently translating **from ${langData[prefs.from].displayName.toLowerCase()} to ${langData[prefs.to].displayName.toLowerCase()}**! :sunglasses:`)
   }
}


module.exports = statusCommand
