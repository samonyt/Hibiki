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
            return msg.say('This channel is not marked as NSFW.');
        }
        try {
            const { body } = await get('http://api.obutts.ru/noise/1');
            return msg.say({ files: [`https://media.obutts.ru/${body.preview}`] });
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
