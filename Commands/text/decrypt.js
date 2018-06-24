const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class Decrypt extends Command {
    constructor(client) {
        super(client, {
            name: 'decrypt',
            group: 'text',
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
            msg.say(stripIndents`
                        ✅ Decrypted!

                        ${this.client.encryptor.decrypt(text)}
                        `);
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
