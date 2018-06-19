const { Command } = require('discord.js-commando');

module.exports = class TagList extends Command {
    constructor(client) {
        super(client, {
            name: 'tag-list',
            aliases: ['tl', 'all-tags', 't-list', 't-l'],
            group: 'tags',
            memberName: 'tag-list',
            description: 'Lists the tags available in the guild.',
            details: '',
            examples: ['', ''],
            format: '[]',
            guildOnly: true,
        });
    }

    async run(msg) {
        const provider = this.client.provider;
        let tags = provider.get(msg.guild, 'tags', []);
        tags = tags.map((tag) => tag.trigger).join(', ');
        if (!tags) return msg.say(`No tags available on \`${msg.guild.name}\`.`);
        msg.say(`📝 Tags available on \`${msg.guild.name}\`: \`\`\`fix\n${tags}\`\`\``);
    }
};
