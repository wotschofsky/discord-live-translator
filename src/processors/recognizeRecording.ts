import fs from 'fs/promises';

import env from '../env';
import writeToLog from '../utils/writeToLog';

const recognizeRecording = async (fileName: string) => {
  writeToLog(`Analyzing "${fileName}"...`);

  const audio = await fs.readFile(fileName);

  const response = await fetch(env.STT_HOST, {
    method: 'POST',
    headers: {
      'Content-Type': 'audio/wav'
    },
    body: audio
  });

  if (!response.ok) {
    console.error(`Speech-to-text failed with status ${response.status}`);
    return '';
  }

  const result = await response.text();

  fs.unlink(fileName).catch((err) => {
    console.error(`Failed to delete ${fileName} - ${err}`);
  });

  return result;
};

export default recognizeRecording;
