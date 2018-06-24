const { Command } = require('discord.js-commando');

module.exports = class WhitelistUser extends Command {
    constructor(client) {
        super(client, {
            name: 'whitelist-user',
            aliases: ['whitelist'],
            group: 'owner',
            memberName: 'whitelist-user',
            ownerOnly: true,
            description: 'Remove a user from this bot\'s blacklist.',
            details: 'Only the bot owner may use this command.',
            examples: ['blacklist @User#1234'],
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'user',
                prompt: 'Who should get removed from the blacklist?\n',
                type: 'user'
            }]
        });
    }

    async run(msg, { user }) {
        const blacklist = await this.client.provider.get('global', 'blacklistUsers', []);
        if (!blacklist.includes(user.id)) return msg.say(this.client.translate('commands.whitelist.notBlacklisted'));

        const index = await blacklist.indexOf(user.id);
        await blacklist.splice(index, 1);

        if (blacklist.length === 0) await this.client.provider.remove('global', 'blacklistUsers');
        else await this.client.provider.set('global', 'blacklistUsers', blacklist);

        return msg.react('✅');
    }
};
