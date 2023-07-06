import path from 'node:path';
import { isMainThread, Worker } from 'node:worker_threads';

type MainToWorkerMessage = {
  type: 'start';
  modelPath: string;
  audioPath: string;
};

type WorkerToMainMessage =
  | {
      type: 'success';
      result: string;
    }
  | {
      type: 'error';
    };

export const whisperFull = (audioPath: string, modelPath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!isMainThread) {
      reject(new Error('whisperFull can only be called from the main thread'));
      return;
    }

    const worker = new Worker(path.resolve(__dirname, './worker.js'));

    worker.on('message', (message: WorkerToMainMessage) => {
      switch (message.type) {
        case 'success': {
          resolve(message.result);
          break;
        }
        case 'error': {
          reject(new Error('Failed to recognize recording'));
          break;
        }
      }
    });

    worker.postMessage({
      type: 'start',
      audioPath,
      modelPath
    } as MainToWorkerMessage);
  });
