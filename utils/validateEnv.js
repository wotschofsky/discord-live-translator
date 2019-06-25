let requiredValues = [
   'BOT_TOKEN',
   'SPEECH_TO_TEXT_IAM_APIKEY',
   'SPEECH_TO_TEXT_URL',
   'TEXT_TO_SPEECH_IAM_APIKEY',
   'TEXT_TO_SPEECH_URL',
   'LANGUAGE_TRANSLATOR_IAM_APIKEY',
   'LANGUAGE_TRANSLATOR_URL'
]

let failed = false
requiredValues.forEach((value) => {
   if(!process.env[value]) {
      console.error(`${value} not set in env!`)
      failed = true
   }
})

if(failed) {
   process.exit()
}
