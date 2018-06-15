const { Command } = require("discord.js-commando");
const { get } = require("snekfetch");

module.exports = class OwO extends Command {
    constructor(client) {
        super(client, {
            name: "owo",
            group: "image",
            memberName: "owo",
            description: "Responds with a random OwO image.",
            examples: ["owo"]
        });
    }

    async run(msg) {
        try {
            const { body } = await get("https://rra.ram.moe/i/r?type=owo");
            return msg.say({ files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: body.path }] });
        } catch (err) {
            return msg.say(this.client.translate("commands.error"), err.message);
        }
    }
};
