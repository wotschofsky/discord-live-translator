import type { VoiceConnection } from 'discord.js';

import AudioQueue from '../utils/AudioQueue';
import getConfig from '../utils/getConfig';
import writeToLog from '../utils/writeToLog';

const queue = new AudioQueue();

const readText = async (connection: VoiceConnection, message: string, lang: string) => {
  writeToLog(`Adding "${message}" to audio queue...`);

  const config = await getConfig();
  const host = config.languages[lang].ttsHost;

  const audioUrl = `${host}/api/tts?text=${encodeURIComponent(message)}`;

  queue.attemptPlay(connection, audioUrl);
};

export default readText;
