import dotenv from 'dotenv';
import Discord from 'discord.js';
import {Ping} from "./commands/Ping";
import {Play} from "./commands/Play";

// https://gabrieltanner.org/blog/dicord-music-bot

// load the environment variables from the .env file
dotenv.config({
  path: '.env'
});

const client = new Discord.Client();
const ping = new Ping();
const play = new Play();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});
client.once('disconnect', () => {
  console.log('Disconnect!');
});

// Create an event listener for messages
client.on('message', async message => {
  if (!message.content.startsWith(process.env.MESSAGE_PREFIX)) return;

  ping.parse(message, client);
  play.parse(message, client);
});


client.login(process.env.DISCORD_TOKEN);
