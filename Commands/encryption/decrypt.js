const { Command } = require('discord.js-commando');
const Raven = require('raven');

module.exports = class Decrypt extends Command {
    constructor(client) {
        super(client, {
            name: 'decrypt',
            group: 'encryption',
            memberName: 'decrypt',
            description: 'Decrypts your encrypted text.',
            args: [{
                key: 'text',
                prompt: 'What would you like to decrypt?\n',
                type: 'string',
            }]
        });
    }

    run(msg, { text }) {
        try {
            msg.say(`🔓 \`${this.client.encryptor.decrypt(text)}\``);
        } catch (err) {
            Raven.captureException(err);
            return msg.say('I was unable to decrypt your message.');
        }
    }
};
