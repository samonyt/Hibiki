const { Command } = require('discord.js-commando');

module.exports = class Restart extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            aliases: ['shutdown'],
            group: 'owner',
            memberName: 'restart',
            description: 'Restarts the bot process.',
            guarded: true
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    run(msg) {
        msg.say('Bye 👋');
        setTimeout(() => {
            process.exit(0);
        }, 3000);
    }
};