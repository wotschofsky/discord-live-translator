const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3')


const languageTranslator = new LanguageTranslatorV3({
   version: '2019-06-24',
   iam_apikey: process.env.LANGUAGE_TRANSLATOR_IAM_APIKEY,
   url: process.env.LANGUAGE_TRANSLATOR_URL,
   headers: {
      'X-Watson-Learning-Opt-Out': 'true'
   }
})


module.exports = languageTranslator
