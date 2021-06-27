import type { CommandHandler } from '../types';

const notFoundCommand: CommandHandler = (client, message, command) => {
  const p = process.env.COMMAND_PREFIX;
  message.reply(`command not found! Use "${p}translation help" for an overview of all commands.`);
};

export default notFoundCommand;
