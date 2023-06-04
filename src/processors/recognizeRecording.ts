import fs from 'fs/promises';
// @ts-ignore
import { whisper } from 'whisper-node';

import writeToLog from '../utils/writeToLog';

const recognizeRecording = async (fileName: string) => {
  writeToLog(`Analyzing "${fileName}"...`);

  // TODO Create custom bindings for whisper
  const result: { speech: string }[] = await whisper(fileName, {
    modelName: 'small',
    whisperOptions: {
      word_timestamps: false
    }
  });

  fs.unlink(fileName).catch((err) => {
    console.error(`Failed to delete ${fileName} - ${err}`);
  });

  if (!result) {
    return '';
  }

  return result.map((line) => line.speech).join(' ');
};

export default recognizeRecording;
