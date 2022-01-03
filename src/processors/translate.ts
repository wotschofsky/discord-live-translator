import axios from 'axios';

import getConfig from '../utils/getConfig';
import writeToLog from '../utils/writeToLog';

const config = getConfig();

const translate = async (text: string, from: string, to: string): Promise<string> => {
  writeToLog(`Translating "${text}" from ${from} into ${to}...`);

  if (!text) {
    return '';
  }

  const response = await axios({
    url: `${config.translationHost}/translate`,
    method: 'POST',
    data: {
      q: text,
      source: from,
      target: to
    }
  });

  return response.data.translatedText;
};

export default translate;
