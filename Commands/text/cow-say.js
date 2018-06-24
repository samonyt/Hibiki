const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class CowSay extends Command {
    constructor(client) {
        super(client, {
            name: 'cow-say',
            aliases: ['cow'],
            group: 'text',
            memberName: 'cow-say',
            description: 'Responds with a cow saying your text.',
            args: [{
                key: 'text',
                prompt: 'What text would you like the cow to say?',
                type: 'string',
                max: 1500
            }]
        });
    }

    async run(msg, { text }) {
        try {
            const { body } = await get('http://cowsay.morecode.org/say')
                .query({
                    message: text,
                    format: 'json'
                });
            return msg.code(null, body.cow);
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
