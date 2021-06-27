type UserSettings = {
  from: string;
  to: string;
};

class SettingsStorage {
  private data: { [guild: string]: { [user: string]: UserSettings } } = {};

  public get(guild: string, user: string): UserSettings | undefined {
    if (guild in this.data) {
      if (user in this.data[guild]) {
        return this.data[guild][user];
      }
    }
  }

  public set(guild: string, user: string, from: string, to: string) {
    if (!(guild in this.data)) {
      this.data[guild] = {};
    }

    this.data[guild][user] = {
      from: from,
      to: to
    };
  }

  public delete(guild: string, user: string) {
    if (!(guild in this.data)) {
      return;
    }

    delete this.data[guild][user];

    if (Object.keys(this.data[guild]).length === 0) {
      delete this.data[guild];
    }
  }
}

const settingsStorage = new SettingsStorage();

export default settingsStorage;
