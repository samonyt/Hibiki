const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Coffee extends Command {
    constructor(client) {
        super(client, {
            name: 'coffee',
            aliases: ['kofi'],
            group: 'image',
            memberName: 'coffee',
            description: 'Responds with a random coffee. ☕'
        });
    }

    async run(msg) {
        try {
            const { body } = await get('https://coffee.alexflipnote.xyz/random.json');
            return msg.say({ files: [{ attachment: body.file, name: 'coffee.png' }] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
