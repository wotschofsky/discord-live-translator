import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { joinCommand } from './commands/join';
import { languagesCommand } from './commands/languages';
import { leaveCommand } from './commands/leave';
import { startCommand } from './commands/start';
import { statusCommand } from './commands/status';
import { stopCommand } from './commands/stop';

const commands = [
  joinCommand.toJSON(),
  languagesCommand.toJSON(),
  leaveCommand.toJSON(),
  startCommand.toJSON(),
  statusCommand.toJSON(),
  stopCommand.toJSON()
];

export const initGuildCommands = async (token: string, clientId: string, guildId: string) => {
  const rest = new REST({ version: '9' }).setToken(token);

  try {
    console.log('Started updating guild (/) commands.');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

    console.log('Successfully updated guild (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

export const initGlobalCommands = async (token: string, clientId: string) => {
  const rest = new REST({ version: '9' }).setToken(token);

  try {
    console.log('Started updating global (/) commands.');

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log('Successfully updated global (/) commands.');
  } catch (error) {
    console.error(error);
  }
};
