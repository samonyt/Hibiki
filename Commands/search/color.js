const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { get } = require('snekfetch');
const Raven = require('raven');

module.exports = class Color extends Command {
    constructor(client) {
        super(client, {
            name: 'color',
            aliases: ['colour', 'hex'],
            group: 'information',
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
            msg.say(stripIndents`
                **Name**: ${body.name}
                **HEX**: ${body.hex}
                **RGB**: ${body.rgb}
            `, { files: [{ attachment: body.image, name: 'color.png '}] });
        } catch (err) {
            Raven.captureException(err);
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);    
        }
    }
};