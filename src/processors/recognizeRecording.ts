import fs from 'fs/promises';
import path from 'node:path';

import { whisperFull } from '../lib/whisper';
import writeToLog from '../utils/writeToLog';

const modelPath = path.join(__dirname, '../../models/ggml-small.bin');

const recognizeRecording = async (fileName: string) => {
  writeToLog(`Analyzing "${fileName}"...`);

  const result = whisperFull(fileName, modelPath);

  fs.unlink(fileName).catch((err) => {
    console.error(`Failed to delete ${fileName} - ${err}`);
  });

  return result;
};

export default recognizeRecording;
