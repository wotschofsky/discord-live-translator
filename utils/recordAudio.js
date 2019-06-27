const fs = require('fs-extra')


const recordAudio = (receiver, user, fileName) => {
   return new Promise((resolve, reject) => {
      let audioStream = receiver.createPCMStream(user)
      let outputStream = fs.createWriteStream(fileName)

      audioStream.pipe(outputStream)

      audioStream.on('end', () => {
         console.log(`I'm no longer listening to ${user.id}`)
      })

      outputStream.on('finish', () => {
         resolve()
      })
   })
}


module.exports = recordAudio
