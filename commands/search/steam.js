const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

module.exports = class Steam extends Command {
    constructor(client) {
        super(client, {
            name: "steam",
            aliases: ["steam-user"],
            group: "info",
            memberName: "steam",
            description: "Searches user on Steam and returns information",
            examples: ["steam <user steam id here>"],
            args: [{
                key: "user",
                prompt: "What is the user's Steam user ID?\n",
                type: "string"
            }]
        });
    }

    async run(msg, { user }) {
        const t = (str) => this.client.translate(str);
        try {
            const { body } = await get(`https://api.alexflipnote.xyz/steam/user/${user}`);
            const embed = new MessageEmbed()
                .setColor(0x000000)
                .setAuthor(t("commands.steam.author")[0], t("commands.steam.author")[1], t("commands.steam.author")[2])
                .setThumbnail(body.avatars.avatarmedium)
                .addField(t("commands.steam.username"),
                    body.profile.username, true)
                .addField(t("commands.steam.realname"),
                    body.profile.realname || t("commands.n/A"), true)
                .addField(t("commands.steam.timeCreated"),
                    body.profile.timecreated, true)
                .addField(t("commands.steam.summary"),
                    body.profile.summary || "None", true)
                .addField(t("commands.steam.state"),
                    body.profile.state, true)
                .addField(t("commands.steam.privacy"),
                    body.profile.privacy, true)
                .addField(t("commands.steam.location"),
                    body.profile.location, true)
                .addField(t("commands.steam.vacBans"),
                    `${body.profile.vacbanned}`, true)
                .addField(t("commands.steam.customURL"),
                    body.id.customurl, true);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(this.client.translate("commands.error"), err.message);
        }
    }
};
