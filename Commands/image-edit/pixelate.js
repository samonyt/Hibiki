const { Command } = require('discord.js-commando');

module.exports = class Pixelate extends Command {
    constructor(client) {
        super(client, {
            name: 'pixelate',
            aliases: ['pixel'],
            group: 'image-edit',
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
        const { pixelate } = this.client.modules.API;
        try {
            return msg.say({ files: [{ attachment: pixelate(user.displayAvatarURL({ size: 2048 })), name: 'pixelate.png' }] });
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
