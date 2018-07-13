const { Command } = require('discord.js-commando');

module.exports = class CatFacts extends Command {
    constructor(client) {
        super(client, {
            name: 'cat-facts',
            aliases: ['cat-fact', 'kitten-fact'],
            group: 'fun',
            memberName: 'cat-facts',
            description: 'Responds with a random cat/kitten fact.'
        });
    }

    async run(msg) {
        const { catfacts } = this.client.modules.API;
        try {
            return msg.say(catfacts());
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
