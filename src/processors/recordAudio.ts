import fs from 'fs-extra';
import path from 'path';
import type { User, VoiceConnection } from 'discord.js';

import writeToLog from '../utils/writeToLog';

const recordAudio = (connection: VoiceConnection, callback: (fileName: string, user: User) => void) => {
  const receiver = connection.receiver;

  connection.on('speaking', async (user, speaking) => {
    const fileName = path.join(
      __dirname,
      '../../cache/rec',
      `${connection.channel.guild.id}_${user.id}_${Date.now()}.pcm`
    );

    if (speaking) {
      writeToLog(`${user.tag} started speaking in "${connection.channel.name}" on "${connection.channel.guild.name}"`);

      const audioStream = receiver.createStream(user, { mode: 'pcm' });
      audioStream.pipe(fs.createWriteStream(fileName));

      audioStream.on('end', async () => {
        writeToLog(
          `${user.tag} stopped speaking in "${connection.channel.name}" on "${connection.channel.guild.name}"`
        );

        const { size: fileSize } = await fs.stat(fileName);
        if (fileSize > 0) {
          callback(fileName, user);
        } else {
          fs.rm(fileName);
        }
      });
    }
  });
};

export default recordAudio;
