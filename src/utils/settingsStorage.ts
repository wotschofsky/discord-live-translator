import Redis from 'ioredis';

import env from '../env';
import languages from '../languages';

type UserSettings = {
  target: keyof typeof languages;
};

class SettingsStorage {
  private redis = env.REDIS_URL ? new Redis(env.REDIS_URL) : new Redis();

  private formatKey(guild: string, user: string) {
    return `settings.${guild}.${user}`;
  }

  public async get(guild: string, user: string): Promise<UserSettings | undefined> {
    const key = this.formatKey(guild, user);
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : undefined;
  }

  public async set(guild: string, user: string, target: keyof typeof languages) {
    const key = this.formatKey(guild, user);
    await this.redis.set(key, JSON.stringify({ target }));
  }

  public async delete(guild: string, user: string) {
    const key = this.formatKey(guild, user);
    await this.redis.del(key);
  }
}

const settingsStorage = new SettingsStorage();

export default settingsStorage;
