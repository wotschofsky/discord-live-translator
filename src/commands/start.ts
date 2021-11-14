import getConfig from '../utils/getConfig';
import settingsStorage from '../utils/settingsStorage';
import type { CommandHandler } from '../types';

const startCommand: CommandHandler = async (client, message, command) => {
  if (!message.member || !message.guild) {
    message.reply('an error occurred!');
    return;
  }

  if (command.params.length < 2) {
    message.reply('Invalid format! :x: Format: !translation start <from> <to>');
    return;
  }

  if (command.params[0] === command.params[1]) {
    message.reply('source and destination language may not be the same! :x:');
    return;
  }

  const config = await getConfig();

  if (!(command.params[0] in config.languages)) {
    message.reply(
      `"${command.params[0]}" is not a supported language! Use "!translation languages" for a list of supported ones. :x:`
    );
    return;
  }

  if (!(command.params[1] in config.languages)) {
    message.reply(
      `"${command.params[1]}" is not a supported language! Use "!translation languages" for a list of supported ones. :x:`
    );
    return;
  }

  if (!config.languages[command.params[0]].supports.includes('i')) {
    message.reply(`"${command.params[0]}" is not supported as source language! :x:`);
    return;
  }

  if (!config.languages[command.params[1]].supports.includes('o')) {
    message.reply(`"${command.params[1]}" is not supported as destination language! :x:`);
    return;
  }

  await settingsStorage.set(message.guild.id, message.author.id, command.params[0], command.params[1]);

  message.reply('live translation **activated**! :blush:');
};

export default startCommand;
