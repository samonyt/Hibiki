const { Command } = require("discord.js-commando");

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            aliases: ["pong", "ping-pong"],
            group: "util",
            memberName: "ping",
            description: "Measures the bot ping.",
            examples: ["ping"],
            guarded: true
        });
    }

    async run(msg) {
        const message = await msg.say("Pinging...");
        const ping = Math.round(message.createdTimestamp - msg.createdTimestamp);
        return message.edit(this.client.translate("commands.ping.response", ping, Math.round(this.client.ping)));
    }
};