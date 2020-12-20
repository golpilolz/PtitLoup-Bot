import {ICommand} from "./ICommand";

export abstract class Command implements ICommand {
  protected allowedCommand: Array<string>;

  constructor() {
    this.allowedCommand = [];
  }

  parse(message: any, bot: any): boolean {
    if (this.match(message)) {
      this.action(message);
      return true;
    }
    return false;
  }

  match(message) {
    let allowed = false;
    this.allowedCommand.forEach(element => {
      if (message.content.startsWith(element)) {
        allowed = true;
      }
    });
    return allowed;
  }

  action(message: string) {
  }

  formatMessage(bot: any) {
  }
}
