const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Pixelate extends Command {
    constructor(client) {
        super(client, {
            name: 'pixelate',
            aliases: ['pixel'],
            group: 'image',
            memberName: 'pixelate',
            description: 'Pixelates your image.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'user',
                prompt: 'Who do you want to pixelate?\n',
                type: 'user',
            }]
        });
    }

    async run(msg, { user }) {
        try {
            const { body } = await get('https://api.alexflipnote.xyz/pixelate')
                .query({
                    image: user.displayAvatarURL({ size: 2048 })
                });
            return msg.say({ files: [{ attachment: body, name: 'pixelate.png' }] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
