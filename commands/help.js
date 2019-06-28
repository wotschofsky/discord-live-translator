const helpCommand = (client, message, command) => {
   message.reply(`
   !translation help - show this information
   !translation start <from> <to> - start the translation
   !translation stop - stop the translation
   !translation join - make the bot join your channel in order for it to translate
   !translation leave - make the bot leave your channel
   !translation status - show your current settings
   !translation languages - show all available languages
   `)
}


module.exports = helpCommand
