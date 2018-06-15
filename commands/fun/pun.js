const { Command } = require("discord.js-commando");
const { get} = require("snekfetch");

module.exports = class Pun extends Command {
    constructor(client) {
        super(client, {
            name: "pun",
            group: "fun",
            memberName: "pun",
            description: "Responds with a random pun."
        });
    }

    async run(msg) {
        try {
            const { body } = await get("https://getpuns.herokuapp.com/api/random");
            return msg.say(JSON.parse(body).Pun);
        } catch (err) {
            return msg.say(this.client.translate("commands.error"), err.message);
        }
    }
};
