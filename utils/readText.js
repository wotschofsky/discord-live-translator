const superagent = require('superagent')
const fs = require('fs-extra')
const path = require('path')


const readText = (message, connection) => {
   return new Promise((resolve, reject) => {
      let pathName = path.resolve('..', 'cache', 'tts')
      let fileName = path.join(pathName, `${Math.round(Math.random() * 10e5)}_${Date.now()}.wav`)
      fs.ensureDir(pathName, () => {
         let stream = fs.createWriteStream(fileName)
         superagent
         .get(`https://code.responsivevoice.org/getvoice.php?t=${message}&tl=de&sv=g1&vn=&pitch=0.5&rate=0.5&vol=1&gender=female`)
         .pipe(stream)

         stream.on('finish', () => {
            console.log(`Reading: ${message}`)
            let dispatcher = connection.playFile(fileName)
            dispatcher.on('end', () => {
               fs.remove(fileName)
               resolve()
            })
         })
      })
   })
}


module.exports = readText
