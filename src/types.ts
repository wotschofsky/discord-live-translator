import type { CommandInteraction } from 'discord.js';

export type CommandHandler = (interaction: CommandInteraction) => void | Promise<void>;
