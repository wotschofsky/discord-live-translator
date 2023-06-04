import { SlashCommandBuilder } from '@discordjs/builders';

import type { CommandHandler } from '../types';
import settingsStorage from '../utils/settingsStorage';

export const stopCommand = new SlashCommandBuilder().setName('stop').setDescription('Stop the translation');

export const stopCommandHandler: CommandHandler = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member || !interaction.guild) {
    await interaction.editReply('An error occurred! :grimacing:');
    return;
  }

  try {
    await settingsStorage.delete(interaction.guild.id, interaction.user.id);
  } catch (err) {
    console.error(err);
    await interaction.editReply('An error occurred! :grimacing:');
  }

  await interaction.editReply('Live translation deactivated! :sleeping:');
};
