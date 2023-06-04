import { SlashCommandBuilder } from '@discordjs/builders';

import languages from '@/languages';
import type { CommandHandler } from '@/types';

export const languagesCommand = new SlashCommandBuilder()
  .setName('languages')
  .setDescription('Show all available languages');

export const languagesCommandHandler: CommandHandler = async (interaction) => {
  const response =
    '**Available languages:**\n' +
    Object.entries(languages)
      .map(([key, value]) => `${value.icon}  ${key} *(${value.displayName})*`)
      .join('\n');

  await interaction.reply({ content: response, ephemeral: true });
};
