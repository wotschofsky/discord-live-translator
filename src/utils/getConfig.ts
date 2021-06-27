import fs from 'fs-extra';
import path from 'path';

type Config = {
  languages: {
    [lang: string]: {
      icon: string;
      displayName: string;
      supports: 'i' | 'o' | 'io' | 'oi';
    };
  };
};

const getConfig = async (): Promise<Config> => {
  const content = await fs.readFile(path.join(__dirname, '../../config.json'), { encoding: 'utf8' });
  return JSON.parse(content);
};

export default getConfig;
