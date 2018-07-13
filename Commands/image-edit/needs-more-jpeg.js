const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class NeedsMoreJPEG extends Command {
    constructor(client) {
        super(client, {
            name: 'needs-more-jpeg',
            aliases: ['needsmorejpeg'],
            group: 'image-edit',
            memberName: 'needs-more-jpeg',
            description: 'JPEG-ifies your avatar image.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'user',
                prompt: 'Who do you want to JPEG-ify?\n',
                type: 'user',
            }]
        });
    }

    async run(msg, { user }) {
        try {
            await Jimp.read(user.displayAvatarURL({ format: 'png' })).then(jpegify => {
                return jpegify
                    .quality(10)
                    .getBuffer(Jimp.MIME_JPEG, (err, buff) => {
                        if (err) 
                            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
                        return msg.say({ files: [{ attachment: buff }] });
                    });
            });
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};  