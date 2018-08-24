const { Command } = require('discord.js-commando');
const Raven = require('raven');

module.exports = class Encrypt extends Command {
    constructor(client) {
        super(client, {
            name: 'encrypt',
            group: 'encryption',
            memberName: 'encrypt',
            description: 'Encrypts your text.',
            args: [{
                key: 'text',
                prompt: 'What would you like to encrypt?\n',
                type: 'string',
            }]
        });
    }

    run(msg, { text }) {
        try {
            const encrypt = this.client.encryptor.encrypt(text);
            if (encrypt.length > 1024) return msg.say(this.client.modules.GithubGist(encrypt));
            return msg.say(`🔐 \`${encrypt}\``);
        } catch (err) {
            Raven.captureException(err);
            return msg.say('I was unable to encrypt your message.');
        }
    }
};
