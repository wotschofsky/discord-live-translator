const fs = require('fs-extra')
const path = require('path')

const readText = require('../utils/readText')
const translate = require('../utils/translate')
const convertRecording = require('../utils/convertRecording')
const recognizeRecording = require('../utils/recognizeRecording')
const recordAudio = require('../utils/recordAudio')
const getPreferences = require('../utils/getPreferences')
const langData = require('../langData.json')


const joinCommand = (client, message, command) => {
   console.log('join')
   if(!message.member.voiceChannel) {
      message.reply('please connect to a voice channel first!')
      return
   }

   if(!message.guild.voiceConnection) {
      let { voiceChannel } = message.member
      fs.ensureDir(path.join(__dirname, '..', 'cache', 'rec'), () => {
         voiceChannel.join().then((connection) => {
            let dispatcher = connection.playFile(path.join(__dirname, '..', 'audio', 'bootup.wav'))
            setTimeout(() => {
               dispatcher.end()
            }, 1000)

            message.reply(`I'm here!`)

            // Based on https://gist.github.com/eslachance/fb70fc036183b7974d3b9191601846ba
            let receiver = connection.createReceiver()
            connection.on('speaking', (user, speaking) => {
               let userPreferences = getPreferences(message.guild.id, user.id)
               if(speaking && userPreferences) {
                  console.log(`I'm listening to ${user.id}`)

                  let pathName = path.join(__dirname, '..', 'cache', 'rec')
                  let fileName = path.join(pathName, `${message.guild.id}_${user.id}_${Date.now()}.pcm`)
                  let outputFileName = path.join(pathName, `${message.guild.id}_${user.id}_${Date.now()}.wav`)

                  recordAudio(receiver, user, fileName).then(() => {
                     return convertRecording(fileName, outputFileName)
                  }).then(() => {
                     return recognizeRecording(outputFileName, userPreferences.from)
                  }).then((result) => {
                     return translate(result, userPreferences.from, userPreferences.to)
                  }).then((translation) => {
                     readText(translation, connection, langData[userPreferences.to].ttsModel)
                  })
               }
            })
         })
      })
   }
}


module.exports = joinCommand
