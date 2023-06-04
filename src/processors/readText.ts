import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import type { VoiceConnection } from '@discordjs/voice';

import { audioQueue } from '../utils/AudioQueue';
import languages from '../languages';
import writeToLog from '../utils/writeToLog';

const execPromise = promisify(exec);

const readText = async (connection: VoiceConnection, message: string, lang: keyof typeof languages) => {
  writeToLog(`Adding "${message}" to audio queue...`);

  const pythonScript = path.join(__dirname, '../../python/readText.py');
  const modelName = languages[lang].ttsModel;
  const escapedMessage = message.replaceAll('"', '');
  const fileName = path.join(__dirname, `../../cache/tts/${Math.round(Math.random() * 1000000)}.wav`);

  await execPromise(`python3 ${pythonScript} --model "${modelName}" --text "${escapedMessage}" --output "${fileName}"`);

  audioQueue.play(connection, fileName);
};

export default readText;
