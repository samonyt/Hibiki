const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");
const config = require("../../config");

module.exports = class Osu extends Command {
    constructor(client) {
        super(client, {
            name: "osu",
            aliases: ["osu-user", "osu-stats"],
            group: "info",
            memberName: "osu",
            description: "Searches osu! user and returns information.",
            examples: ["osu <osu! username here>"],
            args: [{
                key: "user",
                prompt: "Please, provide the osu! username of the user.\n",
                type: "string"
            }]
        });
    }

    async run(msg, { user }) {
        try {
            const { body } = await get("https://osu.ppy.sh/api/get_user")
                .query({
                    k: config.keys.osu,
                    u: user,
                    type: "string"
                });
            if (!body.length) return msg.say("404 Results not found.");
            const data = body[0];
            const nA = this.client.translate("commands.n/A");
            const embed = new MessageEmbed()
                .setColor(0xFF66AA)
                .setAuthor("osu!", "https://i.imgur.com/hWrw2Sv.png", "https://osu.ppy.sh/")
                .addField(this.client.translate("commands.osu.username"),
                    data.username, true)
                .addField(this.client.translate("commands.osu.username"),
                    data.user_id, true)
                .addField(this.client.translate("commands.osu.level"),
                    data.level || nA, true)
                .addField(this.client.translate("commands.osu.accuracy"),
                    data.accuracy || nA, true)
                .addField(this.client.translate("commands.osu.rank"),
                    data.pp_rank || nA, true)
                .addField(this.client.translate("commands.osu.playCount"),
                    data.playcount || nA, true)
                .addField(this.client.translate("commands.osu.country"),
                    data.country || nA, true)
                .addField(this.client.translate("commands.osu.rankedScore"),
                    data.ranked_score || nA, true)
                .addField(this.client.translate("commands.osu.totalScore"),
                    data.total_score || nA, true)
                .addField(this.client.translate("commands.osu.SS"),
                    data.count_rank_ss || nA, true)
                .addField(this.client.translate("commands.osu.S"),
                    data.count_rank_s || nA, true)
                .addField(this.client.translate("commands.osu.A"),
                    data.count_rank_a || nA, true);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(this.client.translate("commands.error"), err.message);
        }
    }
};
