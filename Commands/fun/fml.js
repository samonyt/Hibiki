const { Command } = require('discord.js-commando');

module.exports = class FML extends Command {
    constructor(client) {
        super(client, {
            name: 'fml',
            aliases: ['fuck-my-life'],
            group: 'fun',
            memberName: 'fml',
            description: 'Responds with a fml story.'
        });
    }

    async run(msg) {
        const { fml } = this.client.modules.API;
        try {
            return msg.say(fml());
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
