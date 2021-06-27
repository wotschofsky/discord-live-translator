import Discord from 'discord.js';
import dotenv from 'dotenv';

import parseCommand from './utils/parseCommand';
import validateEnv from './utils/validateEnv';

import joinCommand from './commands/join';
import leaveCommand from './commands/leave';
import helpCommand from './commands/help';
import notFoundCommand from './commands/notFound';

dotenv.config();
validateEnv();

const client = new Discord.Client();

client.on('message', (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content.startsWith(process.env.COMMAND_PREFIX as string)) {
    let parsedCommand = parseCommand(message.content);

    switch (parsedCommand.command) {
      case 'join':
        joinCommand(client, message, parsedCommand);
        break;
      case 'leave':
        leaveCommand(client, message, parsedCommand);
        break;
      case 'help':
        helpCommand(client, message, parsedCommand);
        break;
      default:
        notFoundCommand(client, message, parsedCommand);
        break;
    }
  }
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.user?.setActivity('to your beautiful voice', { type: 'LISTENING' });
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
