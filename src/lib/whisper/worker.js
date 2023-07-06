const { isMainThread, parentPort } = require('node:worker_threads');

const whisper = require('../../../build/Release/whisper.node');

if (isMainThread) {
  throw new Error('This file can only be used as a worker');
}

/**
 * @typedef {Object} MainToWorkerMessage
 * @property {'start'} type - The type of the message
 * @property {string} modelPath - The model path
 * @property {string} audioPath - The audio path
 */

/**
 * @typedef {Object} WorkerToMainMessageSuccess
 * @property {'success'} type - The type of the message
 * @property {string} result - The result of the whisper operation
 */

/**
 * @typedef {Object} WorkerToMainMessageError
 * @property {'error'} type - The type of the message
 */

/**
 * @typedef {WorkerToMainMessageSuccess | WorkerToMainMessageError} WorkerToMainMessage
 */

parentPort.on(
  'message',
  /** @param {MainToWorkerMessage} message */ (message) => {
    switch (message.type) {
      case 'start': {
        try {
          const result = whisper.whisperFull(message.audioPath, message.modelPath);
          parentPort.postMessage(
            /** @type {WorkerToMainMessageSuccess} */ {
              type: 'success',
              result
            }
          );
        } catch (error) {
          console.error(error);
          parentPort.postMessage(
            /** @type {WorkerToMainMessageError} */ {
              type: 'error'
            }
          );
        }

        process.exit();
      }
    }
  }
);
