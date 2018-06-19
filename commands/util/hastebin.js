const { Command } = require('discord.js-commando');
const { post } = require('snekfetch');

module.exports = class Hastebin extends Command {
    constructor(client) {
        super(client, {
            name: 'hastebin',
            aliases: ['hb', 'haste'],
            group: 'util',
            memberName: 'hastebin',
            description: 'Uploads a text to Hastebin.',
            args: [{
                key: 'code',
                prompt: 'What code would you like to upload to Hastebin?',
                type: 'code'
            }]
        });
    }

    async run(msg, { code }) {
        try {
            const { body } = await post('https://hastebin.com/documents').send(code.code);
            return msg.say(`https://hastebin.com/${body.key}.${code.lang || 'js'}`);
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
