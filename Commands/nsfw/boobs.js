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
            return msg.say('This channel is not marked as NSFW.');
        }
        try {
            const { body } = await get('http://api.oboobs.ru/noise/1');
            return msg.say({ files: [`https://media.oboobs.ru/${body.preview}`] });
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
