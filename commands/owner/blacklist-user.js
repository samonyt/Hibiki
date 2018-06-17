const { Command } = require("discord.js-commando");

module.exports = class BlacklistUser extends Command {
    constructor(client) {
        super(client, {
            name: "blacklist-user",
            aliases: ["blacklist"],
            group: "owner",
            memberName: "blacklist-user",
            ownerOnly: true,
            description: "Prohibit a user from using Rin.\n",
            details: "Only the bot owner may use this command.\n",
            examples: ["blacklist @User#1234"],
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: "user",
                prompt: "Which user do you want to blacklist?\n",
                type: "user"
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(msg, { user }) {
        if (this.client.isOwner(user.id)) return msg.say(this.client.translate("commands.blacklist.owner"));

        const blacklist = await this.client.provider.get("global", "blacklistUsers", []);
        if (blacklist.includes(user.id)) return msg.say(this.client.translate("commands.blacklist.isBlacklisted"));

        await blacklist.push(user.id);
        await this.client.provider.set("global", "blacklistUsers", blacklist);
        
        return msg.react("✅");
        return msg.say(this.client.translate("commands.blacklist.response", [user.username, this.client.user.username]));
    }
};
