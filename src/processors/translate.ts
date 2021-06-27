import axios from 'axios';

const translate = async (text: string, from: string, to: string): Promise<string> => {
  console.log(`Translating "${text}" from ${from} into ${to}...`);

  if (!text) {
    return '';
  }

  const response = await axios({
    url: `${process.env.TRANSLATION_HOST}/translate`,
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
