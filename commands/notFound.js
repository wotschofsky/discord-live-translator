const notFoundCommand = (client, message, command) => {
   message.reply('command not found! Use "!translation help" for an overview of all commands.')
}


module.exports = notFoundCommand
