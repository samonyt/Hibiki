const { Command } = require('discord.js-commando');

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
            const result = await this.client.modules.UploadToHaste(code);
            return msg.say(result);
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
