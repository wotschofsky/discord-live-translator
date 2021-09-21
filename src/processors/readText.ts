import type { VoiceConnection } from 'discord.js';

import getConfig from '../utils/getConfig';
import writeToLog from '../utils/writeToLog';

const readText = async (connection: VoiceConnection, message: string, lang: string) => {
  writeToLog(`Reading "${message}"...`);

  const config = await getConfig();
  const host = config.languages[lang].ttsHost;

  const audioUrl = `${host}/api/tts?text=${encodeURIComponent(message)}`;
  const dispatcher = connection.play(audioUrl);
};

export default readText;
