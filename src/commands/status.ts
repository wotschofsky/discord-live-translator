import { SlashCommandBuilder } from '@discordjs/builders';

import getConfig from '../utils/getConfig';
import settingsStorage from '../utils/settingsStorage';
import type { CommandHandler } from '../types';

const config = getConfig();

export const statusCommand = new SlashCommandBuilder().setName('status').setDescription('Show your current settings');

export const statusCommandHandler: CommandHandler = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member || !interaction.guild) {
    await interaction.editReply('An error occurred! :grimacing:');
    return;
  }

  const prefs = await settingsStorage.get(interaction.guild.id, interaction.user.id);

  if (!prefs) {
    await interaction.editReply('You currently have not activated live translation! :sleeping:');
  } else {
    const fromLanguage = config.languages[prefs.from];
    const toLanguage = config.languages[prefs.to];

    await interaction.editReply(
      `You are currently translating from ${fromLanguage.icon} ${fromLanguage.displayName} to ${toLanguage.icon} ${toLanguage.displayName}! :thumbsup:`
    );
  }
};
