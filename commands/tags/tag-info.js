const { Command } = require("discord.js-commando");
const { stripIndents } = require("common-tags");

module.exports = class TagInfo extends Command {
    constructor(client) {
        super(client, {
            name: "tag-info",
            aliases: ["ti", "t-info", "t-i"],
            group: "tags",
            memberName: "tag-info",
            description: "Shows information about a tag.",
            details: "Get the information of a tag in this guild.",
            examples: ["taginfo <tag-name>"],
            format: "[tag-name]",
            guildOnly: true,
            args: [{
                key: "tagname",
                prompt: "What is the tag name?",
                type: "string",
            }],
        });
    }

    async run(msg, { tagname }) {
        const provider = this.client.provider;
        const tags = provider.get(msg.guild, "tags", []);
        const tagInfo = tags.find((tag) => {
            if (tagname === tag.trigger) return tag;
        });
        if (tagInfo) return msg.say(stripIndents`
              **Tag name**: \`${tagInfo.trigger}\`
              **Tag date**: \`${tagInfo.date}\`
              **Tag owner**: \`${this.client.users.get(tagInfo.owner).tag} (${this.client.users.get(tagInfo.owner).id})\`
              **Tag content**: \`${tagInfo.content}\`
        `);
        msg.say(`❎ | Tag \`${tagInfo}\` does not exist.`);
    }
};
