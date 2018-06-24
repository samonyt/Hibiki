const { Command } = require('discord.js-commando');

module.exports = class Discrim extends Command {
    constructor(client) {
        super(client, {
            name: 'discrim',
            aliases: ['discriminator'],
            group: 'info',
            memberName: 'discrim',
            description: 'Find the usernames of a certain discriminator.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [{
                key: 'discrim',
                prompt: 'What discrminator would you like to search?\n',
                type: 'string'
            }]
        });
    }

    async run(msg, { discrim }) {
        fetch(msg.client, discrim).then(results => {
            if(!results) return msg.say(this.client.translate('commands.discrim.none', discrim));
            msg.say(this.client.translate('commands.discrim.response', results.length, discrim, results.join(', ')));
        });
    }
};


function fetch(bot, discrim) {
    return new Promise((resolve, reject) => {  // eslint-disable-line no-unused-vars
        resolve(bot.users.filter(user => user.discriminator === discrim).map(user => user.username));
    });
}
