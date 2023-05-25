import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const env = createEnv({
  clientPrefix: 'PUBLIC_',
  client: {},
  server: {
    BOT_TOKEN: z.string(),
    CLIENT_ID: z.string().optional(),
    GUILD_ID: z.string().optional(),
    LOG_PATH: z.string().optional(),
    REDIS_URL: z.string()
  },
  runtimeEnv: process.env
});

export default env;
