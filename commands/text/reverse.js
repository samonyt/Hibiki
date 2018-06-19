const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class Reverse extends Command {
    constructor(client) {
        super(client, {
            name: 'reverse',
            aliases: ['eserever'],
            group: 'text',
            memberName: 'reverse',
            description: '.txet ruoy sesreveR',
            args: [{
                key: 'text',
                prompt: 'What would you like to reverse?\n',
                type: 'string',
            }]
        });
    }

    run(msg, { text }) {
        return msg.say(stripIndents`
                ℹ ${msg.author.toString()} syas..
                
                ${text.split('').reverse().join('')}
                `);
    }
};