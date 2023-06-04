import { AudioPlayer, AudioPlayerStatus, createAudioResource, VoiceConnection } from '@discordjs/voice';

import PlayerPool from './PlayerPool';

class AudioQueue {
  public readonly players = new PlayerPool();
  private queues = new Map<string, Array<string>>();
  private playingIn = new Set<string>();

  public init(connection: VoiceConnection): AudioPlayer {
    const player = this.players.get(connection.joinConfig.guildId);
    connection.subscribe(player);
    return player;
  }

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
    const fileName = this.extractValue(connection.joinConfig.channelId as string);
    if (!fileName) {
      this.playingIn.delete(connection.joinConfig.channelId as string);
      return;
    }

    this.playingIn.add(connection.joinConfig.channelId as string);

    const player = this.players.get(connection.joinConfig.guildId);
    player.play(createAudioResource(fileName));

    player.once(AudioPlayerStatus.Idle, () => {
      this.playFromQueue(connection);
    });
  };

  public add(channelId: string, audioUrl: string) {
    if (!this.queues.has(channelId)) {
      this.queues.set(channelId, []);
    }

    this.queues.get(channelId)?.push(audioUrl);
  }

  public play(connection: VoiceConnection, audioUrl: string) {
    this.add(connection.joinConfig.channelId as string, audioUrl);

    if (!this.playingIn.has(connection.joinConfig.channelId as string)) {
      this.playFromQueue(connection);
    }
  }

  public clear(connection: VoiceConnection) {
    this.queues.delete(connection.joinConfig.channelId as string);
    this.playingIn.delete(connection.joinConfig.channelId as string);
    this.players.get(connection.joinConfig.guildId).pause();
  }

  public stop(connection: VoiceConnection) {
    this.clear(connection);
    this.players.get(connection.joinConfig.guildId).stop();
  }
}

export const audioQueue = new AudioQueue();

export default AudioQueue;
