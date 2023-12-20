import env from '../env';
import type languages from '../languages';
import writeToLog from '../utils/writeToLog';

const translate = async (text: string, target: Exclude<keyof typeof languages, 'en'>): Promise<string> => {
  writeToLog(`Translating "${text}" into ${target}...`);

  if (!text) {
    return '';
  }

  const response = await fetch(`${env.TRANSLATION_HOST}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: target
    })
  });

  if (!(response.status >= 200 && response.status < 300)) {
    console.error(`Translation failed with status ${response.status}`);
    return '';
  }

  const data = await response.json() as { translatedText: string };

  return data.translatedText;
};

export default translate;
