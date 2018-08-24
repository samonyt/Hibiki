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
                type: 'member',
                default: msg => msg.member
            }]
        });
    }

    switchStatus(s) {
        if (s == 'online') return 'online';
        if (s == 'idle') return 'away';
        if (s == 'dnd') return 'busy';
        if (s == 'offline') return 'off';
    }

    run(msg, { member }) {
        const embed = new MessageEmbed()
            .setColor(member.displayHexColor)
            .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
            .setDescription(`${member.user.bot ? 'Bot' : 'User'} is ${this.switchStatus(member.user.presence.status)} ${member.user.presence.game ? `, plays \`${member.user.presence.game.name}\`` : ''}`)
            .addField('Created on',
                `${member.user.createdAt.toDateString()}`, true)
            .addField('Joined on',
                `${member.joinedAt.toDateString()}`, true);
        msg.embed(embed);
    }
};