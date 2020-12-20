import ytdl from "ytdl-core"
import {Command} from "../types/Command";

export class Play extends Command {
  private queue: Map<any, any>;

  constructor() {
    super();
    this.queue = new Map<any, any>();
    this.allowedCommand.push('!play', '!skip', '!stop', '!songlist')
  }

  action(message) {
    const serverQueue = this.queue.get(message.guild.id);

    if (message.content.startsWith(`!play`)) {
      this.execute(message, serverQueue);
      return;
    } else if (message.content.startsWith(`!skip`)) {
      this.skip(message, serverQueue);
      return;
    } else if (message.content.startsWith(`!stop`)) {
      this.stop(message, serverQueue);
      return;
    } else if (message.content.startsWith(`!songlist`)) {
      this.songlist(message, serverQueue);
    }
  }

  async execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      this.queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        const connectionDiscord = await voiceChannel.join();
        queueContruct.connection = connectionDiscord;
        this.play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        this.queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }

  skip(message, serverQueue) {
    if (!message.member.voice.channel) {
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    }
    if (!serverQueue) {
      return message.channel.send("There is no song that I could skip!");
    }
    serverQueue.connection.dispatcher.end();
  }

  stop(message, serverQueue) {
    if (!message.member.voice.channel) {
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    }

    if (!serverQueue) {
      return message.channel.send("There is no song that I could stop!");
    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

  play(guild, song) {
    const serverQueue = this.queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      this.queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(guild, serverQueue.songs[0]);
      }).on("error", console.error);
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }

  songlist(message, serverQueue) {
    message.channel.send(serverQueue.songs.map((i) => `**${i.title}**`).join("\n"));
  }
}
