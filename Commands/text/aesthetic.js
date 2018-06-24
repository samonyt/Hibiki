const { Command } = require('discord.js-commando');

module.exports = class Aesthetic extends Command {
    constructor(client) {
        super(client, {
            name: 'aesthetic',
            aliases: ['vaporwave'],
            group: 'text',
            memberName: 'aesthetic',
            description: 'Aestheticify your text.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to aesthetic-ify?\n',
                type: 'string',
            }]
        });
    }

    run(msg, { text }) {
        const aesthetic = this.client.modules.Vaporwave;
        return msg.say(aesthetic(text));
    }
};
