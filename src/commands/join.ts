import fs from 'fs-extra';
import path from 'path';

import convertRecording from '../processors/convertRecording';
import recordAudio from '../processors/recordAudio';
import type { CommandHandler } from '../types';

const joinCommand: CommandHandler = async (client, message, command) => {
  if (!message.member || !message.guild) {
    message.reply('an error occurred!');
    return;
  }

  if (!message.member.voice.channel) {
    message.reply('please connect to a voice channel first!');
    return;
  }

  await fs.ensureDir(path.join(__dirname, '../../cache/tts'));
  await fs.ensureDir(path.join(__dirname, '../../cache/rec'));

  try {
    const connection = await message.member.voice.channel.join();

    const dispatcher = connection.play(path.join(__dirname, '../../audio/connect.mp3'));
    dispatcher.on('finish', () => {
      console.log(`Joined ${connection.channel.name}!\n\nREADY TO RECORD\n`);

      recordAudio(connection, async (fileName, user) => {
        const userSettings = settingsStorage.get(message.guild?.id as string, user.id);

        if (!userSettings) {
          return;
        }

        const convertedFile = await convertRecording(fileName);
        const originalText = await recognizeRecording(convertedFile, userSettings.from);
        // TODO Process audio
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export default joinCommand;
