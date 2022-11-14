import fetch from 'node-fetch';

import getConfig from '../utils/getConfig';
import writeToLog from '../utils/writeToLog';

const config = getConfig();

const translate = async (text: string, from: string, to: string): Promise<string> => {
  writeToLog(`Translating "${text}" from ${from} into ${to}...`);

  if (!text) {
    return '';
  }

  const response = await fetch(`${config.translationHost}/translate`, {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: from,
      target: to
    })
  });

  if (!response.ok) {
    console.error('Error while translating:', response);
    return '';
  }

  const data = (await response.json()) as Record<string, any>;

  return data.translatedText;
};

export default translate;
