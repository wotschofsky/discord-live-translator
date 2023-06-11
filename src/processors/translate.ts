import env from '../env';
import writeToLog from '../utils/writeToLog';

const translate = async (text: string, from: string, to: string): Promise<string> => {
  writeToLog(`Translating "${text}" from ${from} into ${to}...`);

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
      source: from,
      target: to
    })
  });

  if (!(response.status >= 200 && response.status < 300)) {
    console.error(`Translation failed with status ${response.status}`);
    console.log(await response.text())
    return '';
  }

  const data = await response.json();

  return data.translatedText;
};

export default translate;
