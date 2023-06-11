import { SlashCommandBuilder } from '@discordjs/builders';

import languages from '../languages';
import type { CommandHandler } from '../types';
import settingsStorage from '../utils/settingsStorage';

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
    const targetLanguage = languages[prefs.target];

    await interaction.editReply(
      `You are currently translating into ${targetLanguage.icon} ${targetLanguage.displayName}! :thumbsup:`
    );
  }
};
