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
            const result = await this.client.modules.Hastebin(code);
            return msg.say(result);
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
