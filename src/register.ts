import helpCommand from './commands/help';
import joinCommand from './commands/join';
import leaveCommand from './commands/leave';
import type { CommandHandler } from './types';

const commandsRegister: Record<string, { description: string; handler: CommandHandler }> = {
  join: {
    description: 'Move the bot into your voice channel',
    handler: joinCommand
  },
  leave: {
    description: 'Move the bot out of your voice channel',
    handler: leaveCommand
  },
  help: {
    description: 'Show this help message',
    handler: helpCommand
  }
};

export default commandsRegister;
