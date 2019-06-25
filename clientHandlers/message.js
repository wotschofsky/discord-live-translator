const fs = require('fs-extra')
const path = require('path')

const readText = require('../utils/readText')
const speechToText = require('../watson/speechToText')
const translate = require('../utils/translate')
const convertRecording = require('../utils/convertRecording')


const messageHandler = (client) => {
   return (message) => {
      if(message.author.id === client.user.id) return
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

               message.reply('ready!')

               // Based on https://gist.github.com/eslachance/fb70fc036183b7974d3b9191601846ba
               // create our voice receiver
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
                     outputStream.on('data', console.log)

                     audioStream.on('end', () => {
                        console.log(`I'm no longer listening to ${user.id}`)
                     })

                     outputStream.on('finish', () => {
                        convertRecording(fileName, outputFileName).then(() => {
                           let recognizeStream = speechToText.recognizeUsingWebSocket({
                              objectMode: true,
                              content_type: 'audio/wav',
                              model: 'en-US_BroadbandModel',
                              profanity_filter: false
                           })

                           fs.createReadStream(outputFileName).pipe(recognizeStream)

                           recognizeStream.on('data', (event) => {
                              onEvent('Data:', event)
                              console.log(event)
                              if(event.results.length >= 1) {
                                 translate(event.results[event.result_index].alternatives[0].transcript, 'en-de')
                                    .then((translation) => {
                                       readText(translation, connection)
                                    })
                              }
                           })

                           recognizeStream.on('error', (event) => {
                              onEvent('Error:', event)
                           })

                           recognizeStream.on('close', (event) => {
                              onEvent('Close:', event)
                           })
                        })
                        // console.log(`ffmpeg -f s16le -ar 44.1k -ac 1 -i ${fileName} ${outputFileName}`)
                     })
                  }
               })
            })
         })
      }
   }
}


function onEvent(name, event) {
   console.log(name, JSON.stringify(event, null, 2))
}


module.exports = messageHandler
