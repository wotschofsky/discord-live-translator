import fs from 'fs/promises';
import path from 'path';

import env from '@/env';

const writeToLog = (...data: string[]) => {
  const date = new Date();
  const message = `[${date.toISOString()}] ${data.join(' ')}`;
  console.log(message);

  if (env.LOG_PATH) {
    const logPath = path.isAbsolute(env.LOG_PATH) ? env.LOG_PATH : path.join(process.cwd(), env.LOG_PATH);
    fs.appendFile(logPath, message + '\n').catch((err) => {
      if (err) console.error(err);
    });
  }
};

export default writeToLog;
