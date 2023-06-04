import Discord, { ActivityType, GatewayIntentBits } from 'discord.js';

import { joinCommandHandler } from './commands/join';
import { languagesCommandHandler } from './commands/languages';
import { leaveCommandHandler } from './commands/leave';
import { startCommandHandler } from './commands/start';
import { statusCommandHandler } from './commands/status';
import { stopCommandHandler } from './commands/stop';
import env from './env';
import { initGuildCommands } from './interactions';
import writeToLog from './utils/writeToLog';

const client = new Discord.Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case 'join':
      await joinCommandHandler(interaction);
      break;
    case 'languages':
      await languagesCommandHandler(interaction);
      break;
    case 'leave':
      await leaveCommandHandler(interaction);
      break;
    case 'start':
      await startCommandHandler(interaction);
      break;
    case 'status':
      await statusCommandHandler(interaction);
      break;
    case 'stop':
      await stopCommandHandler(interaction);
      break;
  }
});

client.once('ready', () => {
  if (client.user) {
    writeToLog(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('your beautiful voice', { type: ActivityType.Listening });
  } else {
    writeToLog('Ready but no user available!');
  }
});

client.on('error', console.error);

client.login(env.BOT_TOKEN);

if (env.CLIENT_ID && env.GUILD_ID) {
  initGuildCommands(env.BOT_TOKEN as string, env.CLIENT_ID, env.GUILD_ID)
    .then(() => {
      console.log('Successfully initialized guild commands!');
    })
    .catch(console.error);
}
