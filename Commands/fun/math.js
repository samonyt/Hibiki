const { Command } = require('discord.js-commando');
const math = require('math-expression-evaluator');

module.exports = class Math extends Command {
    constructor(client) {
        super(client, {
            name: 'math',
            group: 'fun',
            memberName: 'math',
            description: 'Responds with a math calculation.',
            guildOnly: true,
            args: [{
                key: 'query',
                prompt: 'What do you want to evaluate?\n',
                type: 'string'
            }]
        });
    }

    run(msg, { query }) {
        try {
            const num = math.eval(query);
            return msg.say(num);
        } catch (err) {
            msg.say(this.client.translate('commands.error', err.message));
        }
    }
};
