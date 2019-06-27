const parseCommand = require('../utils/parseCommand')


const messageHandler = (client) => {
   return (message) => {
      if(message.author.id === client.user.id) return
      if(message.content.indexOf('!') === 0) {
         let parsedCommand = parseCommand(message.content)

         switch(parsedCommand.command) {
            case('join'): require('../commands/join')(client, message, parsedCommand); break
            case('start'): require('../commands/start')(client, message, parsedCommand); break
            case('stop'): require('../commands/stop')(client, message, parsedCommand); break
            case('languages'): require('../commands/languages')(client, message, parsedCommand); break
            default: require('../commands/notFound')
         }
      }
   }
}

module.exports = messageHandler
