import type { CommandHandler } from '../types';

const leaveCommand: CommandHandler = (client, message, command) => {
  if (!message.member) {
    message.reply('an error occurred!');
    return;
  }

  if (!message.member.voice.channel) {
    message.reply('you are currently not in a voice channel!');
    return;
  }

  message.member?.voice.channel.leave();
};

export default leaveCommand;
