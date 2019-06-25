const { exec } = require('child_process')


const convertRecording = (sourceFile, outputFile) => {
   return new Promise((resolve, reject) => {
      exec(`ffmpeg -f s32le -ar 44.1k -ac 1 -i ${sourceFile} ${outputFile}`, (err, stdout, stderr) => {
         if(err) reject(err)
         resolve()
      })
   })
}


module.exports = convertRecording
