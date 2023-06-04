import axios from 'axios';

import env from '@/env';
import writeToLog from '@/utils/writeToLog';

const translate = async (text: string, from: string, to: string): Promise<string> => {
  writeToLog(`Translating "${text}" from ${from} into ${to}...`);

  if (!text) {
    return '';
  }

  const response = await axios({
    url: `${env.TRANSLATION_HOST}/translate`,
    method: 'POST',
    data: {
      q: text,
      source: from,
      target: to
    },
    validateStatus: () => true
  });

  if (!(response.status >= 200 && response.status < 300)) {
    console.error(`Translation failed with status ${response.status}`);
    return '';
  }

  return response.data.translatedText;
};

export default translate;
