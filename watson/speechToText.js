const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1')


const speechToText = new SpeechToTextV1({
   iam_apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY,
   url: process.env.SPEECH_TO_TEXT_URL
})


module.exports = speechToText