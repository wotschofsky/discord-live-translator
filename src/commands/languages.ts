import getConfig from '../utils/getConfig';
import type { CommandHandler } from '../types';

const config = getConfig();

const languagesCommand: CommandHandler = (client, message, command) => {
  let response = 'Available languages:';
  for (let key in config.languages) {
    response += `\n${config.languages[key].icon}  ${key} *(${config.languages[key].displayName})*`;
  }

  message.channel.send(response);
};

export default languagesCommand;
