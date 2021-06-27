import getConfig from '../utils/getConfig';
import type { CommandHandler } from '../types';

const languagesCommand: CommandHandler = async (client, message, command) => {
  const config = await getConfig();

  let response = 'Available languages:';
  for (let key in config.languages) {
    response += `\n${config.languages[key].icon}  ${key} *(${config.languages[key].displayName})*`;
  }

  message.channel.send(response);
};

export default languagesCommand;
