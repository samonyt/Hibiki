const { Command } = require("discord.js-commando");
const { stripIndents } = require("common-tags");

module.exports = class Encrypt extends Command {
    constructor(client) {
        super(client, {
            name: "encrypt",
            group: "text",
            memberName: "encrypt",
            description: "Encrypts your text.",
            args: [{
                key: "text",
                prompt: "What would you like to encrypt?\n",
                type: "string",
            }]
        });
    }

    run(msg, { text }) {
        try {
            msg.say(stripIndents`
                        ✅ Encrypted!

                        ${this.client.encryptor.encrypt(text)}
                        `);
        } catch (err) {
            return msg.say(this.client.translate("commands.error"), err.message);
        }
    }
};
