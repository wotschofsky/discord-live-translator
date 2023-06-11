const whisper = require('../../../build/Release/whisper.node');

export const whisperFull = (audioPath: string, modelPath: string): string => whisper.whisperFull(audioPath, modelPath);
