const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Bill extends Command {
    constructor(client) {
        super(client, {
            name: 'bill',
            group: 'image',
            memberName: 'bill',
            description: 'Responds with a random Be like Bill image.',
            examples: ['bill']
        });
    }

    async run(msg) {
        try {
            const { body } = await get('http://belikebill.azurewebsites.net/billgen-API.php?default=1');
            return msg.say({ files: [{ attachment: body, name: 'bill.png' }] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
