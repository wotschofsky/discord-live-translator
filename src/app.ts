import Discord, { Intents } from 'discord.js';
import dotenv from 'dotenv';

import { initGlobalCommands, initGuildCommands } from './interactions';
import { joinCommandHandler } from './commands/join';
import { languagesCommandHandler } from './commands/languages';
import { leaveCommandHandler } from './commands/leave';
import { startCommandHandler } from './commands/start';
import { statusCommandHandler } from './commands/status';
import { stopCommandHandler } from './commands/stop';
import validateEnv from './utils/validateEnv';
import writeToLog from './utils/writeToLog';

dotenv.config();
validateEnv();

const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case 'join':
      joinCommandHandler(interaction);
      break;
    case 'languages':
      languagesCommandHandler(interaction);
      break;
    case 'leave':
      leaveCommandHandler(interaction);
      break;
    case 'start':
      startCommandHandler(interaction);
      break;
    case 'status':
      statusCommandHandler(interaction);
      break;
    case 'stop':
      stopCommandHandler(interaction);
      break;
  }
});

client.on('messageCreate', async (message) => {
  if (
    !message.author.bot &&
    (message.content.trim() === '!translation' || message.content.trim().startsWith('!translation '))
  ) {
    message.reply(
      'The `!translation` command is no longer supported - use slash commands instead! :x:\n' +
        'If the commands are not available, please reinvite the bot by visiting https://discord-live-translator.felisk.io/'
    );
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

if (process.env.GUILD_ID) {
  initGuildCommands(process.env.BOT_TOKEN as string, process.env.CLIENT_ID as string, process.env.GUILD_ID as string);
} else {
  initGlobalCommands(process.env.BOT_TOKEN as string, process.env.CLIENT_ID as string);
}
