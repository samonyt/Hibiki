const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
const Raven = require('raven');

module.exports = class Colorify extends Command {
    constructor(client) {
        super(client, {
            name: 'colorify',
            aliases: ['colourify'],
            group: 'image',
            memberName: 'colorify',
            description: 'Colorifies an user\'s image.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'user',
                prompt: 'Who would be the user?\n',
                type: 'user'
            }, {
                key: 'c',
                prompt: 'What is the color?\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { user, c }) {
        const image = user.displayAvatarURL({ size: 2048 });
        try {
            const { body } = await get('https://api.alexflipnote.xyz/colourify')
                .query({
                    image,
                    c
                });
            return msg.say({ files: [{ attachment: body, name: 'colorify.png' }] });
        } catch (err) {
            Raven.captureException(err);
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};