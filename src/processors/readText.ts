import type { VoiceConnection } from 'discord.js';

import getConfig from '../utils/getConfig';

const readText = async (connection: VoiceConnection, message: string, lang: string) => {
  console.log(`Reading "${message}"...`);

  const config = await getConfig();
  const host = config.languages[lang].ttsHost;

  const audioUrl = `${host}/api/tts?text=${encodeURIComponent(message)}`;
  const dispatcher = connection.play(audioUrl);
};

export default readText;
