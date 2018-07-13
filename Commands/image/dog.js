const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Dog extends Command {
    constructor(client) {
        super(client, {
            name: 'dog',
            aliases: ['puppy'],
            group: 'image',
            memberName: 'dog',
            description: 'Responds with a random dog.'
        });
    }

    async run(msg) {
        try {
            const { body } = await get('https://random.dog/woof.json');
            return msg.say({ files: [body.url] });
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
