const { Command } = require("discord.js-commando");

module.exports = class TagAdd extends Command {
    constructor(client) {
        super(client, {
            name: "tag-add",
            aliases: ["ta", "t-a", "t-add"],
            group: "tags",
            memberName: "tag-add",
            description: "Adds a tag. (guild only)",
            details: "Add a tag which is usable only in this guild..",
            examples: ["!tagadd 'Rin' 'is very cool'", "!tagadd 'cool' '{{args0}} is very cool'"],
            format: "[trigger] [content]",
            guildOnly: true,
            args: [{
                key: "trigger",
                prompt: "What should be the tag name?",
                type: "string",
            }, {
                key: "content",
                prompt: "What should be in the tag content?",
                type: "string",
            }],
        });
    }

    async run(msg, { trigger, content }) {
        const provider = this.client.provider;
        const testIfTagExists = provider.get(msg.guild, "tags", []).find((x) => {
            if (x.trigger === trigger) return x;
        });
        if (testIfTagExists) return msg.say(`❎ | Tag \`${trigger}\` already exists.`);
        if (trigger === "" || content === "") return msg.say("❎ | The tag name/content cannot be empty.");
        const toBePushed = provider.get(msg.guild, "tags", []);
        toBePushed.push({
            date: new Date().toLocaleString(),
            trigger: trigger,
            content: content,
            owner: msg.author.id,
        });
        provider.set(msg.guild, "tags", toBePushed);
        return msg.say(`✅ | Succesfully added the \`${trigger}\` tag.`);
    }
};
