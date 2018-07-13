const { Command } = require('discord.js-commando');

module.exports = class Pun extends Command {
    constructor(client) {
        super(client, {
            name: 'pun',
            group: 'fun',
            memberName: 'pun',
            description: 'Responds with a random pun.'
        });
    }

    async run(msg) {
        const { pun } = this.client.modules.API;
        try {
            return msg.say(pun());
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
