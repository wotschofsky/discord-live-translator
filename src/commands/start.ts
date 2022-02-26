import { SlashCommandBuilder } from '@discordjs/builders';

import getConfig from '../utils/getConfig';
import settingsStorage from '../utils/settingsStorage';
import type { CommandHandler } from '../types';

const config = getConfig();

const languageChoices: [name: string, value: string][] = Object.keys(config.languages).map((key) => [
  config.languages[key].displayName,
  key
]);
const inputLanguageChoices = languageChoices.filter(([name, value]) => config.languages[value].supports.includes('i'));
const outputLanguageChoices = languageChoices.filter(([name, value]) => config.languages[value].supports.includes('o'));

export const startCommand = new SlashCommandBuilder()
  .setName('start')
  .setDescription('Start the translation')
  .addStringOption((option) =>
    option.setName('from').setDescription('From Language').addChoices(inputLanguageChoices).setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('to').setDescription('To Language').addChoices(outputLanguageChoices).setRequired(true)
  );

export const startCommandHandler: CommandHandler = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member || !interaction.guild) {
    await interaction.editReply('An error occurred! :grimacing:');
    return;
  }

  const fromLanguage = interaction.options.getString('from') as string;
  const toLanguage = interaction.options.getString('to') as string;

  if (fromLanguage === toLanguage) {
    await interaction.editReply('Source and target language may not be the same! :x:');
    return;
  }

  if (!(fromLanguage in config.languages)) {
    await interaction.editReply(
      `"${fromLanguage}" is not a supported language! Use "/languages" for a list of supported ones. :x:`
    );
    return;
  }

  if (!(toLanguage in config.languages)) {
    await interaction.editReply(
      `"${toLanguage}" is not a supported language! Use "/languages" for a list of supported ones. :x:`
    );
    return;
  }

  if (!config.languages[fromLanguage].supports.includes('i')) {
    await interaction.editReply(`"${fromLanguage}" is not supported as source language! :x:`);
    return;
  }

  if (!config.languages[toLanguage].supports.includes('o')) {
    await interaction.editReply(`"${toLanguage}" is not supported as destination language! :x:`);
    return;
  }

  await settingsStorage.set(interaction.guild.id, interaction.user.id, fromLanguage, toLanguage);

  await interaction.editReply('Live translation activated! :thumbsup:');
};
