import { AudioPlayerStatus, createAudioResource, getVoiceConnection } from '@discordjs/voice';
import { SlashCommandBuilder } from '@discordjs/builders';
import path from 'path';

import { audioQueue } from '../utils/AudioQueue';
import { isGuildMember } from '../utils/is';
import type { CommandHandler } from '../types';

export const leaveCommand = new SlashCommandBuilder()
  .setName('leave')
  .setDescription('Move the bot out of your voice channel');

export const leaveCommandHandler: CommandHandler = async (interaction) => {
  await interaction.deferReply();

  if (!interaction.member || !isGuildMember(interaction.member) || !interaction.guildId) {
    await interaction.editReply('An error occurred! :grimacing:');
    return;
  }

  const connection = getVoiceConnection(interaction.guildId);

  if (!connection) {
    await interaction.editReply('The bot currently is not connected to a voice channel! :x:');
    return;
  }

  if (!interaction.member.voice.channel) {
    await interaction.editReply('You are currently not in a voice channel! :x:');
    return;
  }

  if (interaction.member.voice.channel.id !== connection.joinConfig.channelId) {
    await interaction.editReply('You are currently not in the same voice channel as the bot is in! :x:');
    return;
  }

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
