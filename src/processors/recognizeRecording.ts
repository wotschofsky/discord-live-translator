import { Model } from 'deepspeech';
import fs from 'fs-extra';
import path from 'path';

import getConfig from '../utils/getConfig';
import writeToLog from '../utils/writeToLog';

const ds: Record<string, Model> = {};

getConfig().then((config) => {
  for (const lang in config.languages) {
    const langDetails = config.languages[lang];
    writeToLog(`Initializing STT model for ${langDetails.displayName}...`);
    ds[lang] = new Model(path.join(__dirname, '../../models', langDetails.sttModel));
    ds[lang].enableExternalScorer(path.join(__dirname, '../../models', langDetails.sttScorer));
  }
});

const recognizeRecording = async (fileName: string, lang: string) => {
  writeToLog(`Analyzing "${fileName}"...`);

  const data = await fs.readFile(fileName);
  const result = ds[lang].stt(data);

  fs.remove(fileName);

  return result;
};

export default recognizeRecording;
