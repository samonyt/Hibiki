const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Boobs extends Command {
    constructor(client) {
        super(client, {
            name: 'boobs',
            aliases: ['boob'],
            group: 'nsfw',
            memberName: 'boobs',
            description: 'Responds with random boobs [NSFW].'
        });
    }

    async run(msg) {
        if (!msg.channel.nsfw) {
            return msg.say(this.client.translate('commands.nsfw.notNSFW'));
        }
        try {
            const { body } = await get('http://api.oboobs.ru/noise/1');
            return msg.say({ files: [`https://media.oboobs.ru/${body.preview}`] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
