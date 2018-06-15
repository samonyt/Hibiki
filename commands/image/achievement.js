const { Command } = require("discord.js-commando");
const { get } = require("snekfetch");

module.exports = class Achievement extends Command {
    constructor(client) {
        super(client, {
            name: "achievement",
            group: "image",
            memberName: "achievement",
            description: "Sends a Minecraft-like achievement with your text.",
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: "text",
                prompt: "What should the achievement text be?",
                type: "string",
                validate: text => {
                    if (text.length < 25) return true;
                    return "Please keep the text under 25 characters.";
                }
            }, {
                key: "item",
                prompt: "Select the item ID. (max: 39).",
                type: "integer"
            }]
        });
    }

    async run(msg, { text, item }) {
        try {
            const { body } = await get("https://www.minecraftskinstealer.com/achievement/a.php")
                .query({
                    i: item,
                    h: "Achievement get!",
                    t: text
                });
            return msg.say({ files: [{ attachment: body, name: "achievement.png" }] });
        } catch (err) {
            return msg.say(this.client.translate("commands.error"), err.message);
        }
    }
};
