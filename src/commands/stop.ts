import settingsStorage from '../utils/settingsStorage';
import type { CommandHandler } from '../types';

const stopCommand: CommandHandler = async (client, message, command) => {
  if (!message.member || !message.guild) {
    message.reply('an error occurred!');
    return;
  }

  await settingsStorage.delete(message.guild.id, message.author.id);

  message.reply('live translation **deactivated**! :sleeping:');
};

export default stopCommand;
