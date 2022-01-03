import path from 'path';

type Config = {
  commandPrefix: string;
  translationHost: string;
  languages: {
    [lang: string]: {
      icon: string;
      displayName: string;
      sttModel: string;
      sttScorer: string;
      ttsHost: string;
      translatorCode: string;
      supports: 'i' | 'o' | 'io' | 'oi';
    };
  };
};

const getConfig = (): Config => require(path.join(__dirname, '../../config.json'));

export default getConfig;
