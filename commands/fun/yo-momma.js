const { Command } = require("discord.js-commando");
const { get } = require("snekfetch");

module.exports = class YoMomma extends Command {
    constructor(client) {
        super(client, {
            name: "yo-momma",
            aliases: ["yo-mama"],
            group: "fun",
            memberName: "yo-momma",
            description: "Responds with a random yo mama/momma joke."
        });
    }

    async run(msg) {
        try {
            const res = await get("http://api.yomomma.info")
                .then(data => JSON.parse(data.text));
            return msg.say(res.joke);
        } catch (err) {
            return msg.say(this.client.translate("commands.error"), err.message);
        }
    }
};
