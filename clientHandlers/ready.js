const readyHandler = (client) => {
   return () => {
      console.log(`Logged in as ${client.user.tag}!`)
   }
}


module.exports = readyHandler
