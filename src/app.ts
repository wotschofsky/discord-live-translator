import Discord, { Intents } from 'discord.js';
import dotenv from 'dotenv';

import commandsRegister from './register';
import getConfig from './utils/getConfig';
import notFoundCommand from './commands/notFound';
import parseCommand from './utils/parseCommand';
import validateEnv from './utils/validateEnv';
import writeToLog from './utils/writeToLog';

dotenv.config();
validateEnv();

const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return;
  }

  const config = await getConfig();

  if (message.content.startsWith(config.commandPrefix)) {
    let parsedCommand = parseCommand(config.commandPrefix, message.content);

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
  if (client.user) {
    writeToLog(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('your beautiful voice', { type: 'LISTENING' });
  } else {
    writeToLog('Ready but no user available!');
  }
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
