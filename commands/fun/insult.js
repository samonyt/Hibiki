const { Command } = require('discord.js-commando');
const insults = require('../../assets/json/insults');

module.exports = class Insult extends Command {
    constructor(client) {
        super(client, {
            name: 'insult',
            group: 'fun',
            memberName: 'insult',
            description: 'Responds with a random insult.',
            guildOnly: true,
            args: [{
                key: 'user',
                prompt: 'Who do you want to insult?',
                type: 'user',
                default: msg => msg.author
            }]
        });
    }

    run(msg, { user }) {
        const random = type => type[Math.floor(Math.random() * type.length)];
        if (user === this.client.user) {
            return msg.say(this.client.translate('commands.8ball.bot'));
        }
        msg.say(this.client.translate('commands.8ball.response', user.toString, random(insults.start), random(insults.middle), random(insults.end)));
    }
};
