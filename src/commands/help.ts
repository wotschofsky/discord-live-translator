import type { CommandHandler } from '../types';

const helpCommand: CommandHandler = (client, message, command) => {
  const p = process.env.COMMAND_PREFIX;
  message.reply(`
${p}translation help - show this information
  `);
};

export default helpCommand;
