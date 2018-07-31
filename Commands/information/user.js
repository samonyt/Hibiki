const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class User extends Command {
    constructor(client) {
        super(client, {
            name: 'user',
            aliases: ['user-info', 'userinfo'],
            group: 'information',
            memberName: 'user',
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
            .addField('❯ Username',
                member.user.tag, true)
            .addField('❯ ID',
                member.id, true)
            .addField('❯ Created at',
                member.user.createdAt.toDateString(), true)
            .addField('❯ Joined at',
                member.joinedAt.toDateString(), true)
            .addField('❯ Nickname',
                member.nickname || 'None', true)
            .addField('❯ Is bot?',
                member.user.bot ? 'Yes' : 'No', true)
            .addField('❯ Status',
                this.client.modules.Status(member.user.presence.status), true)
            .addField('❯ Playing',
                member.user.presence.game ? member.user.presence.game.name : 'Nothing', true);
        msg.embed(embed);
    }
};