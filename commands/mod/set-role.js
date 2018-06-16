const { Command } = require("discord.js-commando");

module.exports = class SetRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: "set-role",
            aliases: ["sr", "srole", "ar", "add-role"],
            group: "mod",
            memberName: "set-role",
            description: "Gives a user a role.",
            guildOnly: true,
            args: [{
                key: "member",
                prompt: "What user would you like to give a role to?\n",
                type: "member"
            }, {
                key: "role",
                prompt: "What role would you like to give the user?\n",
                type: "role"
            }]
        });
    }

    hasPermission(msg) {
        return msg.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS") || this.client.isOwner(msg.author.id);
    }

    async run(msg, { member, role }) {
        const t = (str) => this.client.translate(str);
        const user = member.user;

        const botMember = await msg.guild.members.fetch(msg.client.user);
        if (!botMember.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return msg.say(t("commands.set-role.noPerms"));

        await member.addRoles([role]);
        return msg.say(t("commands.set-role.response", role.name, user.tag));
    }
};