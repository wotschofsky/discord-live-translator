import helpCommand from './commands/help';
import joinCommand from './commands/join';
import languagesCommand from './commands/languages';
import leaveCommand from './commands/leave';
import startCommand from './commands/start';
import statusCommand from './commands/status';
import stopCommand from './commands/stop';
import type { CommandHandler } from './types';

const commandsRegister: Record<string, { description: string; handler: CommandHandler }> = {
  help: {
    description: 'Show this help message',
    handler: helpCommand
  },
  join: {
    description: 'Move the bot into your voice channel',
    handler: joinCommand
  },
  languages: {
    description: 'Show all available languages',
    handler: languagesCommand
  },
  leave: {
    description: 'Move the bot out of your voice channel',
    handler: leaveCommand
  },
  start: {
    description: 'Start the translation',
    handler: startCommand
  },
  status: {
    description: 'Show your current settings',
    handler: statusCommand
  },
  stop: {
    description: 'Stop the translation',
    handler: stopCommand
  }
};

export default commandsRegister;
