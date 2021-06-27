import Discord from 'discord.js';
import dotenv from 'dotenv';

import validateEnv from './utils/validateEnv';

dotenv.config();
validateEnv();

const client = new Discord.Client();

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.user?.setActivity('to your beautiful voice', { type: 'LISTENING' });
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
