const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const filterLevels = ["Off", "No Role", "Everyone"];
const verificationLevels = ["None", "Low", "Medium", "(╯°□°）╯︵ ┻━┻", "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻"];

module.exports = class ServerInfo extends Command {
    constructor(client) {
        super(client, {
            name: "server-info",
            aliases: ["guild-info", "guild", "server"],
            group: "info",
            memberName: "server-info",
            description: "Retrieve server information.\n",
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }
    run(msg) {
        const t = (str) => this.client.translate(str);
        const embed = new MessageEmbed()
            .setThumbnail(msg.guild.iconURL({ size: 2048 }))
            .setColor(0x0E2F44)
            .addField(t("commands.server.name"),
                `${msg.guild.name}`, true)
            .addField(t("commands.server.id"),
                `${msg.guild.id}`, true)
            .addField(t("commands.server.createdAt"),
                `${moment.utc(msg.guild.createdAt).format("MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField(t("commands.server.region"),
                `${this.client.utils.Region(msg.guild.region)}`, true)
            .addField(t("commands.server.owner"),
                `${this.client.users.get(msg.guild.ownerID).tag} 👑`, true)
            .addField(t("commands.server.members"),
                `${msg.guild.memberCount}`, true)
            .addField(t("commands.server.roles"),
                `${msg.guild.roles.size}`, true)
            .addField(t("commands.server.channels"),
                `${msg.guild.channels.size}`, true)
            .addField(t("commands.server.filter"),
                `${filterLevels[msg.guild.explicitContentFilter]}`, true)
            .addField(t("commands.server.verifLevel"),
                `${verificationLevels[msg.guild.verificationLevel]}`, true)
            .addField(t("commands.server.afk"),
                `${msg.guild.afkChannelID ? `<#${msg.guild.afkChannelID}> after ${msg.guild.afkTimeout / 60}min` : "None"}`, true);
        return msg.embed(embed);

    }
};