const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Announce extends Command {
    constructor(client) {
        super(client, {
            name: 'announce',
            aliases: ['announcement'],
            group: 'mod',
            memberName: 'announce',
            description: 'Sends an announcement on the announcement(s) channel.',
            examples: ['announce Hello!'],
            args: [{
                key: 'text',
                prompt: 'What would you like to announce?\n',
                type: 'string'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_MESSAGES');
    }

    run(msg, { text }) {
        const channel = this.client.channels.get(msg.guild.settings.get('announceChannel'));
        if (!channel) {
            return msg.say(this.client.translate('commands.announce.noChannel'));
        }
        try {
            const embed = new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                .setColor(this.client.color)
                .setDescription(text)
                .setTimestamp(`${new Date().toLocaleString()} | ${this.client.version}`);
            return channel.send({ embed });
            return msg.say(this.client.translate('commands.announce.response'));
        } catch (err) {
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
