import fs from 'fs-extra';
import path from 'path';
import type { VoiceConnection } from 'discord.js';

const recordAudio = (connection: VoiceConnection, callback: (fileName: string) => void) => {
  const receiver = connection.receiver;

  connection.on('speaking', async (user, speaking) => {
    const fileName = path.join(
      __dirname,
      '../../cache/rec',
      `${connection.channel.guild.id}_${user.id}_${Date.now()}.pcm`
    );

    if (speaking) {
      console.log(`${user.tag} started speaking in "${connection.channel.name}" on "${connection.channel.guild.name}"`);

      const audioStream = receiver.createStream(user, { mode: 'pcm' });
      audioStream.pipe(fs.createWriteStream(fileName));

      audioStream.on('end', async () => {
        console.log(
          `${user.tag} stopped speaking in "${connection.channel.name}" on "${connection.channel.guild.name}"`
        );

        const { size: fileSize } = await fs.stat(fileName);
        if (fileSize > 0) {
          callback(fileName);
        } else {
          fs.rm(fileName);
        }
      });
    }
  });
};

export default recordAudio;
