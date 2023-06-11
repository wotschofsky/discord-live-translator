import env from './env';
import { initGlobalCommands } from './interactions';

if (!env.CLIENT_ID) {
  throw new Error('CLIENT_ID is not set!');
}

initGlobalCommands(env.BOT_TOKEN, env.CLIENT_ID).catch(console.error);
