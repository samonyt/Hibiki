const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

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
        try {
            const { body } = await get('https://api.alexflipnote.xyz/fml');
            return msg.say(body.text);
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
