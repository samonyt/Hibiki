const { Command } = require('discord.js-commando');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { stripIndents } = require('common-tags');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'Assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'Assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'Assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class IllegalCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'illegal',
            aliases: ['is-now-illegal', 'trump', 'first-order-of-business'],
            group: 'image-edit',
            memberName: 'illegal',
            description: 'Makes President Trump make your text illegal.',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                key: 'text',
                prompt: 'What should the text of the bill be?',
                type: 'string',
                parse: text => text.toUpperCase()
            }, {
                key: 'verb',
                prompt: 'Should the text use is, are, or am?',
                type: 'string',
                default: 'IS',
                oneOf: ['is', 'are', 'am'],
                parse: verb => verb.toUpperCase()
            }]
        });
    }

    async run(msg, { text, verb }) {
        const { shortenText } = this.client.modules.Canvas;
        const base = await loadImage(path.join(__dirname, '..', '..', 'Assets', 'images', 'illegal.png'));
        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(base, 0, 0);
        ctx.rotate(7 * (Math.PI / 180));
        ctx.font = '45px Noto';
        ctx.fillText(stripIndents`
			${shortenText(ctx, text, 200)}
			${verb} NOW
			ILLEGAL.
		`, 750, 290);
        return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'illegal.png' }] });
    }
};
