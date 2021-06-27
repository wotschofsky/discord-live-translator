type ParsedCommand = {
  domain: string;
  command: string;
  params: string[];
};

const parseCommand = (prefix: string, command: string) => {
  if (command.startsWith(prefix)) {
    command = command.substr(prefix.length);
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
