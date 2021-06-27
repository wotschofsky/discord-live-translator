type ParsedCommand = {
  domain: string;
  command: string;
  params: string[];
};

const parseCommand = (command: string) => {
  if (command.startsWith(process.env.COMMAND_PREFIX as string)) {
    command = command.substr((process.env.COMMAND_PREFIX as string).length);
  }

  let splitCommand = command.split(' ');
  let obj: ParsedCommand = {
    domain: splitCommand[0],
    command: splitCommand[1],
    params: splitCommand.slice(2)
  };

  return obj;
};

export default parseCommand;
