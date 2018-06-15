const { Command } = require("discord.js-commando");

module.exports = class Tag extends Command {
    constructor(client) {
        super(client, {
            name: "tag",
            aliases: ["t", "tag-show"],
            group: "tags",
            memberName: "tag",
            description: "Shows a tag.",
            details: "Get the content of a tag in this guild.",
            examples: ["tag <tag-name>"],
            format: "[tag-name]",
            guildOnly: true,
            args: [{
                key: "tagname",
                prompt: "Which tag would you like to use?",
                type: "string",
            }],
        });
    }

    async run(msg, { tagname }) {
        const provider = this.client.provider;
        const tags = provider.get(msg.guild, "tags", []);
        const toSay = tags.find((tag) => {
            if (tagname === tag.trigger) return tag;
        });
        if (toSay) return msg.say(toSay.content);
        msg.say(`❎ | Tag \`${tagname}\` does not exist.`);
    }
};
