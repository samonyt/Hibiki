const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

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
        try {
            const res = await get('https://catfact.ninja/fact');
            return msg.say(res.body.fact);
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
