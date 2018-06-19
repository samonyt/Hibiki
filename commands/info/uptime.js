const { Command } = require('discord.js-commando');

module.exports = class Uptime extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            group: 'info',
            memberName: 'uptime',
            description: 'Responds how long this bot was active.',
            guarded: true,
        });
    }

    run(msg) {
        const { duration } = this.client.utils.Util;
        msg.say(this.client.translate('commands.uptime.response', this.client.username, duration(this.client.uptime)));
    }
};