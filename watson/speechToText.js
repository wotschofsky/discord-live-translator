const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1')


const speechToText = new SpeechToTextV1({
   iam_apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY,
   url: process.env.SPEECH_TO_TEXT_URL,
   headers: {
      'X-Watson-Learning-Opt-Out': 'true'
   }
})


module.exports = speechToText
