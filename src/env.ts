import { createEnv } from '@t3-oss/env-core';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const env = createEnv({
  clientPrefix: 'PUBLIC_',
  client: {},
  server: {
    BOT_TOKEN: z.string(),
    CLIENT_ID: z.string().optional(),
    GUILD_ID: z.string().optional(),
    LOG_PATH: z.string().optional(),
    POSTHOG_API_KEY: z.string().optional(),
    POSTHOG_HOST: z.string().optional().default('https://app.posthog.com'),
    REDIS_URL: z.string().optional(),
    STT_HOST: z.string(),
    TRANSLATION_HOST: z.string()
  },
  runtimeEnv: process.env
});

export default env;
