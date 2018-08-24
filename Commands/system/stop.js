const { Command } = require('discord.js-commando');

module.exports = class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['shutdown'],
            group: 'system',
            memberName: 'stop',
            description: 'Stops the bot process.',
            guarded: true
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(msg) {
        await msg.say(':wave:');
        await this.client.logger.warn(`Restart triggered by ${msg.author.username}.`);
        return setTimeout(() => process.exit(0), 500);
    }
};