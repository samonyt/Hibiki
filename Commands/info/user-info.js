const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class UserInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'user-info',
            aliases: ['user', 'userinfo'],
            group: 'info',
            memberName: 'user-info',
            description: 'Retrieve user information.',
            examples: ['user @User#1234'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'member',
                prompt: 'Which user you want to get the information of?\n',
                type: 'member'
            }]
        });
    }
    run(msg, { member }) {
        const embed = new MessageEmbed()
            .setColor(member.displayHexColor)
            .setThumbnail(member.user.displayAvatarURL({ format: 'png' }))
            .addField(this.client.translate('commands.user.username'),
                member.user.tag, true)
            .addField(this.client.translate('commands.user.id'),
                member.id, true)
            .addField(this.client.translate('commands.user.createdAt'),
                member.user.createdAt.toDateString(), true)
            .addField(this.client.translate('commands.user.joinedAt'),
                member.joinedAt.toDateString(), true)
            .addField(this.client.translate('commands.user.nickname'),
                member.nickname !== null ? member.nickname : 'None', true)
            .addField(this.client.translate('commands.user.bot'),
                member.user.bot ? 'Yes' : 'No', true)
            .addField(this.client.translate('commands.user.status'),
                this.client.modules.Status(member.user.presence.status), true)
            .addField(this.client.translate('commands.user.game'),
                member.user.presence.game ? member.user.presence.game.name : 'None', true);
        msg.embed(embed);
    }
};