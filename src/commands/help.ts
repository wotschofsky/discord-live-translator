import commandsRegister from '../register';
import type { CommandHandler } from '../types';

const helpCommand: CommandHandler = (client, message, command) => {
  const p = process.env.COMMAND_PREFIX;

  let response = '';
  for (const command in commandsRegister) {
    const { description } = commandsRegister[command];
    response += `\n**${p}translation ${command}** - ${description}`;
  }

  message.reply(response);
};

export default helpCommand;
