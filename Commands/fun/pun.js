const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
const Raven = require('raven');

module.exports = class Pun extends Command {
    constructor(client) {
        super(client, {
            name: 'pun',
            group: 'fun',
            memberName: 'pun',
            description: 'Responds with a random pun.'
        });
    }

    async run(msg) {
        const { body } = await get('https://getpuns.herokuapp.com/api/random');
        try {
            return msg.say(JSON.parse(body).Pun);
        } catch (err) {
            Raven.captureException(err);
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
