const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class Kick extends Command {
    constructor(client) {
        super(client, {
            name: "kick",
            aliases: ["kicke"],
            group: "mod",
            memberName: "kick",
            description: "Kicks a user when executed.",
            examples: ["kick @User#1234"],
            guildOnly: true,
            args: [{
                key: "member",
                prompt: "Which user do you want to kick?\n",
                type: "member"
            }, {
                key: "reason",
                prompt: "What is the reason?\n",
                type: "string"
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has("BAN_MEMBERS");
    }

    async run(msg, { member, reason } ) {
        const modlog = await msg.guild.channels.get(msg.guild.settings.get("modLog"));
        if (!msg.guild.me.permissions.has("KICK_MEMBERS")) return msg.say(this.client.translate("commands.kick.me.noPerms"));
        if (!modlog) return msg.say(this.client.translate("commands.noModLog", msg.guild.commandPrefix));
        try {
            await msg.guild.member(member).kick(reason);
            const embed = new MessageEmbed()
                .setColor(0xFFFF00)
                .setDescription(this.client.translate("commands.kick.embed.response", member.user.tag, msg.author.tag, reason));
            await this.client.modDM(["kick", "kicked"], msg.guild, member.user, msg.author, reason);
            await modlog.send({ embed });
            await msg.say(this.client.translate("commands.ban.response", member.user.tag, reason));
        } catch (err) {
            await msg.say(this.client.translate("commands.error", err.message));
        }
    }
};