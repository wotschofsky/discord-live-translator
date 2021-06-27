import type { CommandHandler } from '../types';
import getConfig from '../utils/getConfig';

const notFoundCommand: CommandHandler = async (client, message, command) => {
  const config = await getConfig();
  const p = config.commandPrefix;

  message.reply(`command not found! Use "${p}translation help" for an overview of all commands.`);
};

export default notFoundCommand;
