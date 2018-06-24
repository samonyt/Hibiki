const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Triggered extends Command {
    constructor(client) {
        super(client, {
            name: 'triggered',
            group: 'image',
            memberName: 'triggered',
            description: 'Responds with a random triggered image.',
            examples: ['triggered']
        });
    }
    
    async run(msg) {
        try {
            const { body } = await get('https://rra.ram.moe/i/r?type=triggered');
            return msg.say({ files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: body.path }] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
