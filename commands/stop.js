const storage = require('../storage')


const stopCommand = (client, message, command) => {
   storage.unset(`${message.guild.id}.${message.author.id}`).write()
   message.reply('live translation **deactivated**! :sleeping:')
   if(storage.get(message.guild.id).size().value() === 0) {
      storage.unset(message.guild.id).write()
   }
}


module.exports = stopCommand
