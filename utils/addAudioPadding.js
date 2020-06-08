const { exec } = require('child_process')


const addAudioPadding = (sourceFile, outputFile, amount = 1) => {
   return new Promise((resolve, reject) => {
      exec(`${require('ffmpeg-static').path} -f lavfi -t 1 -i anullsrc=channel_layout=stereo:sample_rate=44100 -i ${sourceFile} -filter_complex "[1:a][0:a]concat=n=2:v=0:a=1" ${outputFile}`, (err, stdout, stderr) => {
         if(err) reject(err)
         resolve()
      })
   })
}


module.exports = addAudioPadding
