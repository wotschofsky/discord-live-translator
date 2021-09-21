import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';

import writeToLog from '../utils/writeToLog';

const convertRecording = (sourceFile: string): Promise<string> => {
  writeToLog(`Converting "${sourceFile}"...`);

  const splitFileName = sourceFile.split('.');
  const outputFile = [...splitFileName.slice(0, -1), 'wav'].join('.');

  return new Promise((resolve, reject) => {
    ffmpeg(sourceFile)
      .inputOptions(['-f s16le', '-ar 48.0k', '-ac 2'])
      .output(outputFile)
      .outputOptions(['-ar 16k', '-ac 1'])
      .on('error', (error) => {
        reject(error);
      })
      .on('end', () => {
        writeToLog('Finished processing');
        resolve(outputFile);
        fs.remove(sourceFile);
      })
      .run();
  });
};

export default convertRecording;
