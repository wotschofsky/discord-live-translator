import type { VoiceConnection } from 'discord.js';

class AudioQueue {
  private queues = new Map<string, Array<string>>();
  private playingIn = new Set<string>();

  private addValue = (key: string, value: string): void => {
    if (!this.queues.has(key)) {
      this.queues.set(key, []);
    }

    this.queues.get(key)?.push(value);
  };

  private extractValue = (key: string): string | void => {
    if (!this.queues.has(key)) {
      return;
    }

    const queue = this.queues.get(key);
    if (!queue) return;

    const value = queue.shift();

    if (queue.length === 0) {
      this.queues.delete(key);
    }

    return value;
  };

  private playFromQueue = (connection: VoiceConnection): void => {
    const fileName = this.extractValue(connection.channel.id);
    if (!fileName) {
      this.playingIn.delete(connection.channel.id);
      return;
    }

    this.playingIn.add(connection.channel.id);
    const dispatcher = connection.play(fileName);

    dispatcher.on('finish', () => {
      this.playFromQueue(connection);
    });
  };

  public attemptPlay = (connection: VoiceConnection, audioUrl: string): void => {
    this.addValue(connection.channel.id, audioUrl);

    if (!this.playingIn.has(connection.channel.id)) {
      this.playFromQueue(connection);
      return;
    }
  };
}

export default AudioQueue;
