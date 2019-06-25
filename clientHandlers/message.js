const fs = require('fs-extra')
const path = require('path')
const { exec } = require('child_process')

const readText = require('../utils/readText')
const speechToText = require('../watson/speechToText')
const translate = require('../utils/translate')


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
                  if(speaking) {nsole.log(`I'm listening to ${user.id}`)

                     const audioStream = receiver.createOpusStream(user)

                     let pathName = path.join(__dirname, '..', 'cache', 'rec')
                     let fileName = path.join(pathName, `${message.guild.id}_${user.id}_${Date.now()}.opus`)
                     // let outputFileName = path.join(pathName, `${message.guild.id}_${user.id}_${Date.now()}.wav`)
                     let outputStream = fs.createWriteStream(fileName)

                     audioStream.pipe(outputStream)
                     outputStream.on('data', console.log)

                     audioStream.on('end', () => {
                        console.log(`I'm no longer listening to ${user.id}`)
                     })

                     outputStream.on('finish', () => {
                        console.log('Recording done')
                        // exec(`ffmpeg -f s16le -ar 44.1k -ac 1 -i ${fileName} ${outputFileName}`, (err, stdout, stderr) => {
                        //    if(err) return console.error(err)
                        //    console.log(`stdout: ${stdout}`);
                        //    console.log(`stderr: ${stderr}`);
                        // })
                        // console.log(`ffmpeg -f s16le -ar 44.1k -ac 1 -i ${fileName} ${outputFileName}`)
                        var recognizeStream = speechToText.recognizeUsingWebSocket({
                           objectMode: true,
                           content_type: 'audio/webm;codecs=opus',
                           model: 'de-DE_BroadbandModel',
                           profanity_filter: false
                        })
   
                        fs.createReadStream(fileName).pipe(recognizeStream)
   
                        recognizeStream.on('data', (event) => {
                           onEvent('Data:', event)
                           // console.log(event.results)
                           // translate(event.results[event.result_index].alternatives[0].transcript, 'en-de')
                           //    .then((translation) => {
                           //       readText(translation, connection)
                           //    })
                        })
   
                        recognizeStream.on('error', (event) => {
                           onEvent('Error:', event)
                        })
   
                        recognizeStream.on('close', (event) => {
                           onEvent('Close:', event)
                        })
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