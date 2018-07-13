const { Command } = require('discord.js-commando');

module.exports = class Coffee extends Command {
    constructor(client) {
        super(client, {
            name: 'coffee',
            aliases: ['kofi'],
            group: 'image',
            memberName: 'coffee',
            description: 'Responds with a random coffee. ☕'
        });
    }

    async run(msg) {
        const { coffee } = this.client.modules.API;
        try {
            return msg.say({ files: [{ attachment: coffee(), name: 'coffee.png' }] });
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
