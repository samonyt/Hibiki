const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Ass extends Command {
    constructor(client) {
        super(client, {
            name: 'ass',
            aliases: ['butt'],
            group: 'nsfw',
            memberName: 'ass',
            description: 'Responds with a random ass [NSFW].'
        });
    }

    async run(msg) {
        if (!msg.channel.nsfw) {
            return msg.say(this.client.translate('commands.nsfw.notNSFW'));
        }
        try {
            const { body } = await get('http://api.obutts.ru/noise/1');
            return msg.say({ files: [`https://media.obutts.ru/${body.preview}`] });
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
