const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Gender extends Command {
    constructor(client) {
        super(client, {
            name: 'gender',
            aliases: ['guess-gender'],
            group: 'analyze',
            memberName: 'gender',
            description: 'Determines the gender of a real name.',
            args: [{
                key: 'first',
                label: 'first name',
                prompt: 'What first name do you want to determine the gender of?',
                type: 'string',
                max: 500,
                parse: first => encodeURIComponent(first)
            }, {
                key: 'last',
                label: 'last name',
                prompt: 'What last name do you want to determine the gender of?',
                type: 'string',
                default: 'null',
                max: 500,
                parse: last => encodeURIComponent(last)
            }]
        });
    }

    async run(msg, { first, last }) {
        try {
            const { body } = await get(`https://api.namsor.com/onomastics/api/json/gender/${first}/${last}`);
            if (body.gender === 'unknown') return msg.say(this.client.translate('commands.gender.notFound', body.firstName));
            return msg.say(this.client.translate('commands.gender.response', `${Math.abs(body.scale * 100)}%`, body.firstName, body.gender));
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
