import { AudioPlayer, createAudioPlayer } from '@discordjs/voice';

class PlayerPool {
  private players = new Map<string, AudioPlayer>();

  public get(guildId: string): AudioPlayer {
    if (this.players.has(guildId)) {
      return this.players.get(guildId) as AudioPlayer;
    }

    const player = createAudioPlayer();
    this.players.set(guildId, player);
    return player;
  }

  public stop(guildId: string): void {
    if (this.players.has(guildId)) {
      (this.players.get(guildId) as AudioPlayer).stop();
      this.players.delete(guildId);
    }
  }
}

export default PlayerPool;
