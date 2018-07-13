const { Command } = require('discord.js-commando');

module.exports = class Bill extends Command {
    constructor(client) {
        super(client, {
            name: 'bill',
            group: 'image',
            memberName: 'bill',
            description: 'Responds with a random Be like Bill image.',
            examples: ['bill']
        });
    }

    async run(msg) {
        const { bill } = this.client.modules.API;
        try {
            return msg.say({ files: [{ attachment: bill(), name: 'bill.png' }] });
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
