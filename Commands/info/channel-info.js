const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const types = {
    dm: 'DM',
    group: 'Group DM',
    text: 'Text Channel',
    voice: 'Voice Channel',
    category: 'Category',
    unknown: 'Unknown'
};

module.exports = class ChannelInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'channel-info',
            aliases: ['channel'],
            group: 'info',
            memberName: 'channel-info',
            description: 'Retrieves channel information.\n',
            args: [{
                key: 'channel',
                prompt: 'Which channel would you like to get the information on?',
                type: 'channel'
            }]
        });
    }
    run(msg, { channel }) {
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .addField(this.client.translate('commands.channel.name'),
                `${msg.guild.name}`, true)
            .addField(this.client.translate('commands.channel.id'),
                `${msg.guild.id}`, true)
            .addField(this.client.translate('commands.channel.category'),
                `${channel.parent ? channel.parent.name : 'None'}`, true)
            .addField(this.client.translate('commands.channel.topic'),
                `${channel.topic}`, true)
            .addField(this.client.translate('commands.channel.createdOn'),
                `${channel.createdAt.toDateString()}`, true)
            .addField(this.client.translate('commands.channel.nsfw'),
                `${channel.nsfw ? 'Yes': 'No'}`, true)
            .addField(this.client.translate('commands.channel.type'),
                `${types[channel.type]}`, true);
        return msg.embed(embed);

    }
};