import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus, createAudioResource, getVoiceConnection } from '@discordjs/voice';
import path from 'node:path';

import type { CommandHandler } from '../types';
import { audioQueue } from '../utils/AudioQueue';
import { isGuildMember } from '../utils/is';

export const leaveCommand = new SlashCommandBuilder()
  .setName('leave')
  .setDescription('Move the bot out of your voice channel');

export const leaveCommandHandler: CommandHandler = async (interaction) => {
  if (!interaction.member || !isGuildMember(interaction.member) || !interaction.guildId) {
    await interaction.reply({ content: 'An error occurred! :grimacing:', ephemeral: true });
    return;
  }

  const connection = getVoiceConnection(interaction.guildId);

  if (!connection) {
    await interaction.reply({ content: 'The bot currently is not connected to a voice channel! :x:', ephemeral: true });
    return;
  }

  if (!interaction.member.voice.channel) {
    await interaction.reply({ content: 'You are currently not in a voice channel! :x:', ephemeral: true });
    return;
  }

  if (interaction.member.voice.channel.id !== connection.joinConfig.channelId) {
    await interaction.reply({
      content: 'You are currently not in the same voice channel as the bot is in! :x:',
      ephemeral: true
    });
    return;
  }

  await interaction.deferReply();

  if (connection) {
    const player = audioQueue.players.get(interaction.guildId);

    player.play(createAudioResource(path.join(__dirname, '../../audio/disconnect.mp3')));

    player.once(AudioPlayerStatus.Idle, async () => {
      audioQueue.stop(connection);
      connection.destroy();

      await interaction.editReply('Successfully left the voice channel! :wave:');
    });
  }
};
