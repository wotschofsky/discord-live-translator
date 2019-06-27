const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')


const textToSpeech = new TextToSpeechV1({
   iam_apikey: process.env.TEXT_TO_SPEECH_IAM_APIKEY,
   url: process.env.TEXT_TO_SPEECH_URL,
   headers: {
      'X-Watson-Learning-Opt-Out': 'true'
   }
})


module.exports = textToSpeech
