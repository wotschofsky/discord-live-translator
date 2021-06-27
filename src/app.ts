import Discord from 'discord.js';
import dotenv from 'dotenv';

import commandsRegister from './register';
import notFoundCommand from './commands/notFound';
import parseCommand from './utils/parseCommand';
import validateEnv from './utils/validateEnv';

dotenv.config();
validateEnv();

const client = new Discord.Client();

client.on('message', (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content.startsWith(process.env.COMMAND_PREFIX as string)) {
    let parsedCommand = parseCommand(message.content);

    if (parsedCommand.domain !== 'translation') {
      return;
    }

    if (parsedCommand.command in commandsRegister) {
      const { handler } = commandsRegister[parsedCommand.command];
      handler(client, message, parsedCommand);
    } else {
      notFoundCommand(client, message, parsedCommand);
    }
  }
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.user?.setActivity('to your beautiful voice', { type: 'LISTENING' });
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
