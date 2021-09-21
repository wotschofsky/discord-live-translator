import fs from 'fs-extra';
import path from 'path';

const writeToLog = (...data: string[]) => {
  const date = new Date();
  const message = `[${date.toISOString()}] ${data.join(' ')}`;
  console.log(message);

  if (process.env.LOG_PATH) {
    const logPath = path.isAbsolute(process.env.LOG_PATH)
      ? process.env.LOG_PATH
      : path.join(process.cwd(), process.env.LOG_PATH);
    fs.appendFile(logPath, message + '\n', (err) => {
      if (err) console.error(err);
    });
  }
};

export default writeToLog;
