import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import type { VoiceConnection } from '@discordjs/voice';

import { audioQueue } from '../utils/AudioQueue';
import getConfig from '../utils/getConfig';
import writeToLog from '../utils/writeToLog';

const execPromise = promisify(exec);

const config = getConfig();

const readText = async (connection: VoiceConnection, message: string, lang: string) => {
  writeToLog(`Adding "${message}" to audio queue...`);

  const pythonScript = path.join(__dirname, '../../python/readText.py');
  const modelName = config.languages[lang].ttsModel;
  const escapedMessage = message.replaceAll('"', '');
  const fileName = path.join(__dirname, `../../cache/tts/${Math.round(Math.random() * 1000000)}.wav`);

  await execPromise(`python3 ${pythonScript} --model "${modelName}" --text "${escapedMessage}" --output "${fileName}"`);

  audioQueue.play(connection, fileName);
};

export default readText;
