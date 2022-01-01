import type { VoiceConnection } from '@discordjs/voice';

import { audioQueue } from '../utils/AudioQueue';
import getConfig from '../utils/getConfig';
import writeToLog from '../utils/writeToLog';

const readText = async (connection: VoiceConnection, message: string, lang: string) => {
  writeToLog(`Adding "${message}" to audio queue...`);

  const config = await getConfig();
  const host = config.languages[lang].ttsHost;

  const audioUrl = `${host}/api/tts?text=${encodeURIComponent(message)}`;

  audioQueue.play(connection, audioUrl);
};

export default readText;
