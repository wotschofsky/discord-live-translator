import { SlashCommandBuilder } from '@discordjs/builders';

import getConfig from '../utils/getConfig';
import type { CommandHandler } from '../types';

const config = getConfig();

export const languagesCommand = new SlashCommandBuilder()
  .setName('languages')
  .setDescription('Show all available languages');

export const languagesCommandHandler: CommandHandler = async (interaction) => {
  let response = '**Available languages:**';
  for (let key in config.languages) {
    response += `\n${config.languages[key].icon}  ${key} *(${config.languages[key].displayName})*`;
  }

  await interaction.reply({ content: response, ephemeral: true });
};
