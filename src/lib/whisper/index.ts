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

const queue: {
  audioPath: string;
  modelPath: string;
  onSuccess: (result: string) => void;
  onError: (err: Error) => void;
}[] = [];
let workerActive = false;

export const whisperFull = (audioPath: string, modelPath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!isMainThread) {
      reject(new Error('whisperFull can only be called from the main thread'));
      return;
    }

    queue.push({
      audioPath,
      modelPath,
      onSuccess: resolve,
      onError: reject
    });

    if (!workerActive) {
      processQueue();
    }
  });

const processQueue = () => {
  if (workerActive) {
    return;
  }

  const task = queue.shift();
  if (!task) {
    return;
  }

  workerActive = true;
  const worker = new Worker(path.resolve(__dirname, './worker.js'));

  worker.on('message', (message: WorkerToMainMessage) => {
    switch (message.type) {
      case 'success': {
        task.onSuccess(message.result);
        break;
      }
      case 'error': {
        task.onError(new Error('Failed to recognize recording'));
        break;
      }
    }
  });

  worker.on('exit', () => {
    workerActive = false;
    processQueue();
  });

  worker.postMessage({
    type: 'start',
    audioPath: task.audioPath,
    modelPath: task.modelPath
  } as MainToWorkerMessage);
};
