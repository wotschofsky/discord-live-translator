const languageTranslator = require('../watson/languageTranslator')
const langData = require('../langData.json')


const translate = (text, from, to) => {
   return new Promise((resolve, reject) => {
      languageTranslator.translate({
         text,
         model_id: `${langData[from].translatorCode}-${langData[to].translatorCode}`
      }).then((result) => {
         resolve(result.translations[0].translation)
      }).catch((err) => {
         console.log(err)
         reject(err)
      })
   })
}


module.exports = translate
