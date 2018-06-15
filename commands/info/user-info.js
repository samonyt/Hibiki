const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class UserInfo extends Command {
    constructor(client) {
        super(client, {
            name: "user-info",
            aliases: ["user", "userinfo"],
            group: "info",
            memberName: "user-info",
            description: "Retrieve user information.",
            examples: ["user @User#1234"],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: "member",
                prompt: "Which user you want to get the information of?\n",
                type: "member"
            }]
        });
    }
    run(msg, { member }) {
        const t = (str) => this.client.translate(str);
        const embed = new MessageEmbed()
            .setColor(member.displayHexColor)
            .setThumbnail(member.user.displayAvatarURL({ format: "png" }))
            .addField(t("commands.user.username"),
                member.user.tag, true)
            .addField(t("commands.user.id"),
                member.id, true)
            .addField(t("commands.user.createdAt"),
                member.user.createdAt.toDateString(), true)
            .addField(t("commands.user.joinedAt"),
                member.joinedAt.toDateString(), true)
            .addField(t("commands.user.nickname"),
                member.nickname !== null ? member.nickname : "None", true)
            .addField(t("commands.user.bot"),
                member.user.bot ? "Yes" : "No", true)
            .addField(t("commands.user.status"),
                this.client.utils.Status(member.user.presence.status), true)
            .addField(t("commands.user.game"),
                member.user.presence.game ? member.user.presence.game.name : "None", true);
        msg.embed(embed);
    }
};