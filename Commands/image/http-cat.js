const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class HTTPCat extends Command {
    constructor(client) {
        super(client, {
            name: 'http-cat',
            aliases: ['hc'],
            group: 'image',
            memberName: 'http-cat',
            description: 'Responds with a HTTP cat based on the code you wrote.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'code',
                prompt: 'What is the code?\n',
                type: 'integer'
            }]
        });
    }

    async run(msg, { code }) {
        try {
            const { body } = await get(`https://http.cat/${code}`);
            return msg.say({ files: [{ attachment: body, name: 'code.png' }] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};