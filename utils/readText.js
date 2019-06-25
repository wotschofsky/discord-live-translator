const fs = require('fs-extra')
const path = require('path')

const textToSpeech = require('../watson/textToSpeech')


const readText = (message, connection) => {
   return new Promise((resolve) => {
      let pathName = path.join(__dirname, '..', 'cache', 'tts')
      let fileName = path.join(pathName, `${Math.round(Math.random() * 10e5)}_${Date.now()}.wav`)
      fs.ensureDir(pathName, () => {
         let stream = fs.createWriteStream(fileName)
         textToSpeech.synthesize({
            text: message,
            accept: 'audio/wav',
            voice: 'de-DE_BirgitV2Voice'
         }).then((audio) => {
            audio.pipe(stream)
            stream.on('finish', () => {
               console.log(`Reading: ${message}`)
               let dispatcher = connection.playFile(fileName)
               dispatcher.on('end', () => {
                  resolve()
                  setTimeout(() => {
                     fs.remove(fileName)
                  }, 1000)
               })
            })
         })
      })
   })
}


module.exports = readText
