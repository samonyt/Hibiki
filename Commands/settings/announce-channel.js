const { Command } = require('discord.js-commando');

module.exports = class AnnounceChannel extends Command {
    constructor(client) {
        super(client, {
            name: 'announce-channel',
            aliases: ['announcement-channel'],
            group: 'settings',
            memberName: 'announce-channel',
            description: 'Sets an announcement channel for this server.',
            guildOnly: true,
            args: [{
                key: 'channel',
                prompt: 'What channel do you want to set for announcement(s)?\n',
                type: 'channel'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || this.client.modules.IsStaff(msg.member);
    }

    run(msg, { channel }) {
        msg.guild.settings.set('announceChannel', channel.id);
        return msg.say(`✅ | Succesfully set **announcement channel** to **${channel.name}** (**${channel.id}**).`);
    }
};