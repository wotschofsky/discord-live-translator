const fs = require('fs-extra')
const path = require('path')

const readText = require('../utils/readText')
const speechToText = require('../watson/speechToText')
const translate = require('../utils/translate')
const convertRecording = require('../utils/convertRecording')
const getPreferences = require('../utils/getPreferences')
const langData = require('../langData.json')


const joinCommand = (client, message, command) => {
   if(!message.member.voiceChannel) {
      message.reply('please connect to a voice channel first!')
      return
   }

   if(!message.guild.voiceConnection) {
      let { voiceChannel } = message.member
      fs.ensureDir(path.join(__dirname, '..', 'cache', 'rec'), () => {
         voiceChannel.join().then((connection) => {
            let dispatcher = connection.playFile(path.join(__dirname, '..', 'legends.mp3'))
            setTimeout(() => {
               dispatcher.end()
            }, 1000)

            message.reply(`I'm here!`)

            // Based on https://gist.github.com/eslachance/fb70fc036183b7974d3b9191601846ba
            const receiver = connection.createReceiver()
            connection.on('speaking', (user, speaking) => {
               if(speaking) {
                  console.log(`I'm listening to ${user.id}`)

                  const audioStream = receiver.createPCMStream(user)

                  let pathName = path.join(__dirname, '..', 'cache', 'rec')
                  let fileName = path.join(pathName, `${message.guild.id}_${user.id}_${Date.now()}.pcm`)
                  let outputFileName = path.join(pathName, `${message.guild.id}_${user.id}_${Date.now()}.wav`)
                  let outputStream = fs.createWriteStream(fileName)

                  audioStream.pipe(outputStream)

                  audioStream.on('end', () => {
                     console.log(`I'm no longer listening to ${user.id}`)
                  })

                  outputStream.on('finish', () => {
                     let userPreferences = getPreferences(message.guild.id, user.id)

                     convertRecording(fileName, outputFileName).then(() => {
                        let recognizeStream = speechToText.recognizeUsingWebSocket({
                           objectMode: true,
                           content_type: 'audio/wav',
                           model: langData[userPreferences.from].sttModel,
                           profanity_filter: false
                        })

                        fs.createReadStream(outputFileName).pipe(recognizeStream)

                        recognizeStream.on('data', (event) => {
                           if(event.results.length >= 1) {
                              translate(event.results[event.result_index].alternatives[0].transcript, `${langData[userPreferences.from].translatorCode}-${langData[userPreferences.to].translatorCode}`)
                                 .then((translation) => {
                                    readText(translation, connection, langData[userPreferences.to].ttsModel)
                                 })
                           }
                        })

                        recognizeStream.on('error', (event) => {
                           console.error('Recognition error:', event)
                        })

                        recognizeStream.on('close', () => {
                           fs.remove(outputFileName)
                        })
                     })
                  })
               }
            })
         })
      })
   }
}


module.exports = joinCommand
