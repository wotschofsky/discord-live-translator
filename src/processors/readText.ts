import type { VoiceConnection } from '@discordjs/voice';
import path from 'node:path';

import languages from '../languages';
import { audioQueue } from '../utils/AudioQueue';
import writeToLog from '../utils/writeToLog';

const readText = async (connection: VoiceConnection, message: string, lang: keyof typeof languages) => {
  // TODO Use regular import
  const { execa } = await import('execa');

  writeToLog(`Adding "${message}" to audio queue...`);

  const pythonScript = path.join(__dirname, '../lib/tts/read_text.py');
  const modelName = languages[lang].ttsModel;
  const escapedMessage = message.replaceAll('"', '');
  const fileName = path.join(__dirname, `../../cache/tts/${Math.round(Math.random() * 1000000)}.wav`);

  try {
    await execa('python3', [pythonScript, '--model', modelName, '--text', escapedMessage, '--output', fileName]);

    audioQueue.play(connection, fileName);
  } catch (error) {
    console.error(error);
  }
};

export default readText;
