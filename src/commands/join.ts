import { SlashCommandBuilder } from '@discordjs/builders';
import {
  AudioPlayerStatus,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus
} from '@discordjs/voice';
import { PermissionsBitField } from 'discord.js';
import fs from 'fs-extra';
import path from 'node:path';

import languages from '../languages';
import readText from '../processors/readText';
import recognizeRecording from '../processors/recognizeRecording';
import recordAudio from '../processors/recordAudio';
import translate from '../processors/translate';
import type { CommandHandler } from '../types';
import { audioQueue } from '../utils/AudioQueue';
import { isGuildMember } from '../utils/is';
import settingsStorage from '../utils/settingsStorage';

export const joinCommand = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Move the bot into your voice channel');

export const joinCommandHandler: CommandHandler = async (interaction) => {
  if (!interaction.member || !isGuildMember(interaction.member) || !interaction.guild) {
    await interaction.reply({ content: 'An error occurred! :grimacing:', ephemeral: true });
    return;
  }

  if (!interaction.member.voice.channel) {
    await interaction.reply({ content: 'You are currently not in a voice channel! :x:', ephemeral: true });
    return;
  }

  if (
    !interaction.guild.members.me
      ?.permissionsIn(interaction.member.voice.channel)
      .has([PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak])
  ) {
    await interaction.reply({
      content: 'The bot is missing permission for your channel to connect and/or speak! :grimacing:',
      ephemeral: true
    });
    return;
  }

  await interaction.deferReply();
  await fs.ensureDir(path.join(__dirname, '../../cache/rec'));
  await fs.ensureDir(path.join(__dirname, '../../cache/tts'));

  try {
    const channel = interaction.member.voice.channel;

    let isNewConnection = false;
    let connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      isNewConnection = true;
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        selfDeaf: false,
        selfMute: false,
        // @ts-ignore
        adapterCreator: channel.guild.voiceAdapterCreator
      });
    } else {
      connection.rejoin({
        channelId: channel.id,
        selfDeaf: false,
        selfMute: false
      });
    }

    await entersState(connection, VoiceConnectionStatus.Ready, 20e3);

    const player = audioQueue.init(connection);
    player.play(createAudioResource(path.join(__dirname, '../../audio/connect.mp3')));

    player.once(AudioPlayerStatus.Idle, async () => {
      if (!isNewConnection || !connection) {
        return;
      }

      await interaction.editReply('Successfully connected to your voice channel! :hugging:');

      connection.receiver.speaking.on('start', async (userId) => {
        if (!connection) return;

        const fileName = await recordAudio(connection.receiver, userId);
        if (!fileName) return;

        const userSettings = await settingsStorage.get(interaction.guildId as string, userId);
        if (!userSettings) return;

        const originalText = await recognizeRecording(fileName);
        if (!originalText) return;

        const translatedText =
          userSettings.target === 'en'
            ? originalText
            : await translate(originalText, languages[userSettings.target].translatorCode);

        await readText(connection, translatedText, userSettings.target);
      });
    });
  } catch (err) {
    console.error(err);
    await interaction.editReply('An error occurred! :grimacing:');
  }
};
