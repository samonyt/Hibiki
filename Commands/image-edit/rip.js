const { Command } = require('discord.js-commando');
const Jimp = require('jimp');
const Raven = require('raven');

module.exports = class Rip extends Command {
    constructor(client) {
        super(client, {
            name: 'rip',
            aliases: ['grave', 'gravestone'],
            group: 'image-edit',
            memberName: 'rip',
            description: 'Puts a profile picture over a gravestone.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'user',
                prompt: 'Who do you want me to rip?\n',
                type: 'user',
            }]
        });
    }

    async run(msg, { user }) {
        const avatarURL = user.displayAvatarURL({ format: 'png' });
        const avatar = await Jimp.read(avatarURL);
        const grave = await Jimp.read('./Assets/image/gravestone.jpg');

        avatar.resize(200, 200);

        grave.blit(avatar, 60, 65);
        grave.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) {
                Raven.captureException(err);
                return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
            }
            return msg.say({ files: [{ attachment: buff }] });
        });
    }
};