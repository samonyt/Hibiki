const { Command } = require("discord.js-commando");

module.exports = class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            aliases: ["repeat", "parrot"],
            group: "text",
            memberName: "say",
            description: "Says your text.",
            args: [{
                key: "text",
                prompt: "What would you like to say?\n",
                type: "string",
            }]
        });
    }

    run(msg, { text }) {
        return msg.say(text);
    }
};
