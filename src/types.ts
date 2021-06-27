import type { Client, Message } from 'discord.js';

import type parseCommand from './utils/parseCommand';

export type CommandHandler = (
  client: Client,
  message: Message,
  command: ReturnType<typeof parseCommand>
) => void | Promise<void>;
