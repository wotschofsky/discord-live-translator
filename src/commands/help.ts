import type { CommandHandler } from '../types';

const helpCommand: CommandHandler = (client, message, command) => {
  const p = process.env.COMMAND_PREFIX;
  message.reply(`
${p}translation help - show this information
${p}translation join - make the bot join your channel in order for it to translate
${p}translation leave - make the bot leave your channel
  `);
};

export default helpCommand;
