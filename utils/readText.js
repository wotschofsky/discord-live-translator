const fs = require('fs-extra')
const path = require('path')

const addAudioPadding = require('./addAudioPadding')
const textToSpeech = require('../watson/textToSpeech')


const readText = (message, connection, voice) => {
   return new Promise((resolve) => {
      let pathName = path.join(__dirname, '..', 'cache', 'tts')
      let fileName = path.join(pathName, `${Math.round(Math.random() * 10e5)}_${Date.now()}.wav`)
      let paddedFileName = path.join(pathName, `${Math.round(Math.random() * 10e5)}_${Date.now()}_padded.wav`)
      fs.ensureDir(pathName, () => {
         let stream = fs.createWriteStream(fileName)
         textToSpeech.synthesize({
            text: message,
            accept: 'audio/wav',
            voice
         }).then((audio) => {
            audio.pipe(stream)
            stream.on('finish', () => {
               addAudioPadding(fileName, paddedFileName).then(() => {
                  console.log(`Reading: ${message}`)
                  let dispatcher = connection.playFile(paddedFileName)
                  dispatcher.on('end', () => {
                     resolve()
                     setTimeout(() => {
                        fs.remove(fileName)
                        fs.remove(paddedFileName)
                     }, 1000)
                  })
               })
            })
         })
      })
   })
}


module.exports = readText
