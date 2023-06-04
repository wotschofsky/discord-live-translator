import { SlashCommandBuilder } from '@discordjs/builders';
import { type APIApplicationCommandOptionChoice } from 'discord.js';

import languages from '@/languages';
import type { CommandHandler } from '@/types';
import settingsStorage from '@/utils/settingsStorage';

const languageChoices: APIApplicationCommandOptionChoice<string>[] = Object.entries(languages).map(([key, value]) => ({
  name: value.displayName,
  value: key
}));

export const startCommand = new SlashCommandBuilder()
  .setName('start')
  .setDescription('Start the translation')
  .addStringOption((option) =>
    option
      .setName('from')
      .setDescription('From Language')
      .addChoices(...languageChoices)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('to')
      .setDescription('To Language')
      .addChoices(...languageChoices)
      .setRequired(true)
  );

export const startCommandHandler: CommandHandler = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member || !interaction.guild) {
    await interaction.editReply('An error occurred! :grimacing:');
    return;
  }

  const fromLanguageRaw = interaction.options.get('from')?.value?.toString();
  const toLanguageRaw = interaction.options.get('to')?.value?.toString();

  if (!fromLanguageRaw || !(fromLanguageRaw in languages)) {
    await interaction.editReply(
      `"${fromLanguageRaw}" is not a supported language! Use "/languages" for a list of supported ones. :x:`
    );
    return;
  }
  const fromLanguage = fromLanguageRaw as keyof typeof languages;

  if (!toLanguageRaw || !(toLanguageRaw in languages)) {
    await interaction.editReply(
      `"${toLanguageRaw}" is not a supported language! Use "/languages" for a list of supported ones. :x:`
    );
    return;
  }
  const toLanguage = toLanguageRaw as keyof typeof languages;

  if (fromLanguage === toLanguage) {
    await interaction.editReply('Source and target language may not be the same! :x:');
    return;
  }

  await settingsStorage.set(interaction.guild.id, interaction.user.id, fromLanguage, toLanguage);

  await interaction.editReply('Live translation activated! :thumbsup:');
};
