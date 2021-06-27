import commandsRegister from '../register';
import getConfig from '../utils/getConfig';
import type { CommandHandler } from '../types';

const helpCommand: CommandHandler = async (client, message, command) => {
  const config = await getConfig();
  const p = config.commandPrefix;

  let response = '';
  for (const command in commandsRegister) {
    const { description } = commandsRegister[command];
    response += `\n**${p}translation ${command}** - ${description}`;
  }

  message.reply(response);
};

export default helpCommand;
