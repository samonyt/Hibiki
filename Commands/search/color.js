const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Color extends Command {
    constructor(client) {
        super(client, {
            name: 'color',
            aliases: ['colour', 'hex'],
            group: 'info',
            memberName: 'color',
            description: 'Gives information about providen HEX color.',
            examples: ['color FFFFFF'],
            args: [{
                key: 'color',
                prompt: 'Please, provide a HEX color.\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { color }) {

        try {
            const { body } = await get(`https://api.alexflipnote.xyz/colour/${color}`);
            msg.say(this.client.translate('commands.color.response', body.name, body.hex, body.rgb), { files: [{ attachment: body.image, name: 'color.png '}] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);    
        }
    }
};