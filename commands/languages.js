const langData = require('../langData.json')


const languagesCommand = (client, message, command) => {
   let response = 'Available languages:'
   for(let key in langData) {
      response += `\n${langData[key].icon} ${key} *(${langData[key].displayName})*`
   }
   message.channel.send(response)
}


module.exports = languagesCommand
