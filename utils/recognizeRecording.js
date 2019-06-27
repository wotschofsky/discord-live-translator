const fs = require('fs-extra')

const speechToText = require('../watson/speechToText')
const langData = require('../langData.json')


const recognizeRecording = (fileName, lang) => {
   return new Promise((resolve, reject) => {
      let recognizeStream = speechToText.recognizeUsingWebSocket({
         objectMode: true,
         content_type: 'audio/wav',
         model: langData[lang].sttModel,
         profanity_filter: false
      })

      fs.createReadStream(fileName).pipe(recognizeStream)

      recognizeStream.on('data', (event) => {
         if(event.results.length >= 1) {
            resolve(event.results[event.result_index].alternatives[0].transcript)
         } else {
            reject()
         }
      })

      recognizeStream.on('error', (event) => {
         console.error('Recognition error:', event)
         reject()
      })

      recognizeStream.on('close', () => {
         fs.remove(fileName)
      })
   })
}


module.exports = recognizeRecording
