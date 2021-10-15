import fs from 'fs-extra';
import path from 'path';

import convertRecording from '../processors/convertRecording';
import readText from '../processors/readText';
import recognizeRecording from '../processors/recognizeRecording';
import recordAudio from '../processors/recordAudio';
import settingsStorage from '../utils/settingsStorage';
import translate from '../processors/translate';
import type { CommandHandler } from '../types';
import writeToLog from '../utils/writeToLog';

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
      writeToLog(`Joined ${connection.channel.name}!\n\nREADY TO RECORD\n`);

      recordAudio(connection, async (fileName, user) => {
        const userSettings = settingsStorage.get(message.guild?.id as string, user.id);

        if (!userSettings) {
          return;
        }

        const convertedFile = await convertRecording(fileName);
        const originalText = await recognizeRecording(convertedFile, userSettings.from);
        if (!originalText) return;
        const translatedText = await translate(originalText, userSettings.from, userSettings.to);
        await readText(connection, translatedText, userSettings.to);
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export default joinCommand;
