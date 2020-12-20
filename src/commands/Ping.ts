import {Command} from "../types/Command";

export class Ping extends Command {

  constructor() {
    super();
    this.allowedCommand.push('!ping')
  }

  action(message) {
    message.reply('pong');
  }
}
