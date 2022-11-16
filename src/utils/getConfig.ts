import fs from 'fs';
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

let config: Config | null = null;

const getConfig = (): Config => {
  if (!config) {
    const configPath = path.join(__dirname, '../../config.json');
    config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as Config;
  }
  return config;
};

export default getConfig;
