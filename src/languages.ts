const languages = {
  en: {
    icon: ':flag_us:',
    displayName: 'English',
    translatorCode: 'en',
    ttsModel: 'tts_models/en/ljspeech/vits'
  },
  de: {
    icon: ':flag_de:',
    displayName: 'German',
    translatorCode: 'de',
    ttsModel: 'tts_models/de/thorsten/vits'
  },
  fr: {
    icon: ':flag_fr:',
    displayName: 'French',
    translatorCode: 'fr',
    ttsModel: 'tts_models/fr/mai/tacotron2-DDC'
  },
  es: {
    icon: ':flag_es:',
    displayName: 'Spanish',
    translatorCode: 'es',
    ttsModel: 'tts_models/es/mai/tacotron2-DDC'
  },
  it: {
    icon: ':flag_it:',
    displayName: 'Italian',
    translatorCode: 'it',
    ttsModel: 'tts_models/it/mai_female/vits'
  }
} as const;

export default languages;
