const { Command } = require("discord.js-commando");
const { full, none } = require("../../assets/json/gay");

module.exports = class Gay extends Command {
    constructor(client) {
        super(client, {
            name: "gay",
            group: "analyze",
            memberName: "gay",
            description: "Check user's gayness.",
            examples: ["gay @User#1234"],
            guildOnly: true,
            args: [{
                key: "user",
                prompt: "Which user do you want to check?\n",
                type: "user"
            }]
        });
    }
    run (msg, { user } ) {
        let gayPercent;
        let data;

        if (user.id === this.client.user.id) return msg.say("I'm underage. Pervert.");

        if (none.includes(user.id)) gayPercent = 0;
        else if (full.includes(user.id)) gayPercent = 1e8;
        else gayPercent = gayPercent = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

        data = (gayPercent > 50)
            ? this.client.translate("commands.gay.full", user.username, `${gayPercent}%`)
            :  this.client.translate("commands.gay.zero", user.username, `${gayPercent}%`);

        return msg.say(data);
    }
};
