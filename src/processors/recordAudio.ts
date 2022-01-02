import { EndBehaviorType, VoiceReceiver } from '@discordjs/voice';
import { FileWriter } from 'wav';
import { OpusEncoder } from '@discordjs/opus';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';
import path from 'path';

import writeToLog from '../utils/writeToLog';

// Based on https://github.com/Yvtq8K3n/BobbyMcLovin/blob/3a007a675d36f61c89e1151293250f6cb0a441b9/index.js

class OpusDecodingStream extends Transform {
  encoder;

  constructor(options: any, encoder: any) {
    super(options);
    this.encoder = encoder;
  }

  _transform(data: any, encoding: any, callback: any) {
    this.push(this.encoder.decode(data));
    callback();
  }
}

const recordAudio = async (
  receiver: VoiceReceiver,
  userId: string,
  shouldRecordResolver: (userId: string) => Promise<boolean>
): Promise<string | undefined> => {
  const encoder = new OpusEncoder(16000, 1);

  const fileName = path.join(__dirname, '../../cache/rec', `${userId}_${Date.now()}.wav`);

  const opusStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 100
    }
  });
  const decodingStream = new OpusDecodingStream({}, encoder);
  const fileWriter = new FileWriter(fileName, {
    channels: 1,
    sampleRate: 16000
  });

  const shouldRecord = await shouldRecordResolver(userId);
  if (!shouldRecord) {
    return;
  }

  writeToLog(`Started recording ${userId} to ${fileName}`);

  try {
    // @ts-ignore
    await pipeline(opusStream, decodingStream, fileWriter);

    writeToLog(`Successfully finished recording ${userId} to ${fileName}`);

    return fileName;
  } catch (err) {
    writeToLog(`Failed recording ${userId} to ${fileName} - ${err.message}`);
  }
};

export default recordAudio;
