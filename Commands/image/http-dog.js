const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class HTTPDog extends Command {
    constructor(client) {
        super(client, {
            name: 'http-dog',
            aliases: ['hd'],
            group: 'image',
            memberName: 'http-dog',
            description: 'Responds with a HTTP dog based on the code you wrote.',
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
            const { body, headers } = await get(`https://httpstatusdogs.com/img/${code}.png`);
            if (headers['content-type'].includes('text/html')) return msg.say(this.client.translate('commands.http-dog.missing'));
            return msg.say({ files: [{ attachment: body, name: 'code.png' }] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};