import { AudioPlayerStatus, createAudioResource, getVoiceConnection } from '@discordjs/voice';
import path from 'path';

import { audioQueue } from '../utils/AudioQueue';
import type { CommandHandler } from '../types';

const leaveCommand: CommandHandler = (client, message, command) => {
  if (!message.member || !message.guildId) {
    message.reply('an error occurred!');
    return;
  }

  if (!message.member.voice.channel) {
    message.reply('you are currently not in a voice channel!');
    return;
  }

  const connection = getVoiceConnection(message.guildId);

  if (connection) {
    const player = audioQueue.players.get(message.guildId);

    player.play(createAudioResource(path.join(__dirname, '../../audio/disconnect.mp3')));

    player.once(AudioPlayerStatus.Idle, () => {
      audioQueue.stop(connection);
      connection.destroy();
    });
  }
};

export default leaveCommand;
