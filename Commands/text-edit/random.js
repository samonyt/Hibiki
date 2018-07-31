const { Command } = require('discord.js-commando');

module.exports = class Random extends Command {
    constructor(client) {
        super(client, {
            name: 'random',
            aliases: ['number'],
            group: 'text-edit',
            memberName: 'random',
            description: 'Get a random number between <max> and <min>.',
            args: [{
                key: 'max',
                prompt: 'What would be the maximum number?',
                type: 'integer',
            }, {
                key: 'min',
                prompt: 'What would be the minimum number?',
                type: 'integer'
            }]
        });
    }

    run(msg, { max, min }) {
        msg.say(Math.floor(Math.random() * (max - min + 1)) + min);
    }
};
