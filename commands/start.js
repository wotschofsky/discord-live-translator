const storage = require('../storage')
const langData = require('../langData.json')


const startCommand = (client, message, command) => {
   if(command.params.length < 2) {
      message.reply('Invalid format! :x: Format: !translation start <from> <to>')
      return
   }

   if(command.params[0] === command.params[1]) {
      message.reply('source and destination language may not be the same! :x:')
      return
   }

   if(!langData[command.params[0]]) {
      message.reply(`"${command.params[0]}" is not a supported language! Use "!translation languages" for a list of supported ones. :x:`)
      return
   }

   if(!langData[command.params[1]]) {
      message.reply(`"${command.params[1]}" is not a supported language! Use "!translation languages" for a list of supported ones. :x:`)
      return
   }

   if(!langData[command.params[0]].supports.includes('i')) {
      message.reply(`"${command.params[0]}" is not supported as source language! :x:`)
      return
   }

   if(!langData[command.params[1]].supports.includes('i')) {
      message.reply(`"${command.params[1]}" is not supported as destination language! :x:`)
      return
   }

   storage.set(`${message.guild.id}.${message.author.id}`, {
      from: command.params[0],
      to: command.params[1]
   }).write()
   message.reply('live translation **activated**! :blush:')
}


module.exports = startCommand
