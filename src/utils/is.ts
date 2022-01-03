import { GuildMember } from 'discord.js';

export const isGuildMember = (obj: any): obj is GuildMember => obj.voice !== undefined;
