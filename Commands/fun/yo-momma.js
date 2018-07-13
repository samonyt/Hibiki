const { Command } = require('discord.js-commando');

module.exports = class YoMomma extends Command {
    constructor(client) {
        super(client, {
            name: 'yo-momma',
            aliases: ['yo-mama'],
            group: 'fun',
            memberName: 'yo-momma',
            description: 'Responds with a random yo mama/momma joke.'
        });
    }

    async run(msg) {
        const { yomama } = this.client.modules.API;
        try {
            return msg.say(yomama());
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
