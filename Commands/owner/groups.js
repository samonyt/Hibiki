const { stripIndents } = require('common-tags');
const { Command } = require('discord.js-commando');

module.exports = class Groups extends Command {
    constructor(client) {
        super(client, {
            name: 'groups',
            aliases: ['list-groups', 'show-groups', 'all-groups'],
            group: 'owner',
            memberName: 'groups',
            description: 'Lists all command groups.',
            details: 'Only administrators may use this command.',
            guarded: true
        });
    }

    hasPermission(msg) {
        if (!msg.guild) return this.client.isOwner(msg.author);
        return this.client.isOwner(msg.author) || this.client.modules.IsStaff(msg.member);
    }

    run(msg) {
        return msg.say(stripIndents`
			\`Groups\`
			${this.client.registry.groups.map(grp =>
        `**${grp.name}:** ${grp.isEnabledIn(msg.guild) ? 'Enabled' : 'Disabled'}`
    ).join('\n')}.
		`);
    }
};
