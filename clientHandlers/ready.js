const readyHandler = (client) => {
   return () => {
      console.log(`Logged in as ${client.user.tag}!`)
      client.user.setActivity('the translation game', { type: 'PLAYING' })
   }
}


module.exports = readyHandler
