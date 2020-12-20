export interface ICommand {
    parse(message: any, bot: any): boolean;

    match(message: any): boolean;

    action(message: any);

    formatMessage(bot: any);
}
