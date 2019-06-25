const languageTranslator = require('../watson/languageTranslator')


const translate = (text, model_id) => {
   return new Promise((resolve, reject) => {
      languageTranslator.translate({
         text,
         model_id
      }).then((result) => {
         resolve(result.translations[0].translation)
      }).catch((err) => {
         console.log(err)
         reject(err)
      })
   })
}


module.exports = translate
