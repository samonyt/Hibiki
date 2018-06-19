const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { owner } = require('../../config').opts.ids;

module.exports = class About extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            aliases: ['info', 'information', 'stats'],
            group: 'info',
            memberName: 'about',
            description: 'Information about Rin.',
            guarded: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    run(msg) {
        const { duration } = this.client.utils.Util;
        return msg.say(stripIndents`
        \`\`\`asciidoc\n
        = Rin =

        [Statistics about ${this.client.user.username}.]

        • Owner :: ${this.client.users.get(owner).username}
        • Uptime :: ${duration(this.client.uptime)}
        • Repository :: https://github.com/Rin-bot/Rin
        • Prefix :: ${this.client.commandPrefix}

        = Statistics =

        • Servers :: ${this.client.guilds.size}
        • Channels :: ${this.client.channels.size}
        • Commands :: ${this.client.commands.size}
        • Users :: ${this.client.users.size}
        \`\`\` 
        `,);
    }
};