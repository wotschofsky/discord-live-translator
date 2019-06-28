const { exec } = require('child_process')
const fs = require('fs-extra')


const convertRecording = (sourceFile, outputFile) => {
   return new Promise((resolve, reject) => {
      exec(`${require('ffmpeg-static').path} -f s32le -ar 44.1k -ac 1 -i ${sourceFile} ${outputFile}`, (err, stdout, stderr) => {
         if(err) reject(err)
         resolve()
         // fs.remove(sourceFile)
      })
   })
}


module.exports = convertRecording
