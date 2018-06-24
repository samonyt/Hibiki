const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class DidYouMean extends Command {
    constructor(client) {
        super(client, {
            name: 'did-you-mean',
            aliases: ['didyoumean'],
            group: 'image',
            memberName: 'did-you-mean',
            description: 'Google-like did you mean image command.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'search',
                prompt: 'What should the search text be?\n',
                type: 'string',
                validate: text => {
                    if (text.length < 50) return true;
                    return 'Please keep the text under 50 characters.';
                }
            }, {
                key: 'didyoumean',
                prompt: 'What should be the did you mean text?\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { search, didyoumean }) {
        try {
            const { body } = await get('https://api.alexflipnote.xyz/didyoumean')
                .query({
                    top: search,
                    bottom: didyoumean
                });
            return msg.say({ files: [{ attachment: body, name: 'didyoumean.png' }] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
