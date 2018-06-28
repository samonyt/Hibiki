const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Softban extends Command {
    constructor(client) {
        super(client, {
            name: 'softban',
            aliases: ['softbanne'],
            group: 'mod',
            memberName: 'softban',
            description: 'Softbans a user when executed.',
            examples: ['softban @User#1234'],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'Which user do you want to softban?\n',
                type: 'member'
            }, {
                key: 'reason',
                prompt: 'What is the reason?\n',
                type: 'string'
            }]
        });
    }
        
    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('BAN_MEMBERS');
    }

    async run(msg, { member, reason } ) {
        const modlog = await msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!msg.guild.me.permissions.has('BAN_MEMBERS')) return msg.say(this.client.translate('commands.ban.me.noPerms'));
        if (!modlog) return msg.say(this.client.translate('commands.noModLog', msg.guild.commandPrefix));
        try {
            const embed = new MessageEmbed()
                .setColor(0xFFFF00)
                .setDescription(this.client.translate('commands.softban.embed.response', member.user.tag, msg.author.tag, reason));
            await modlog.send({ embed });
            await member.ban({ days: 0, reason });
            await msg.guild.members.unban(member.id);
            await msg.say(this.client.translate('commands.softban.response', member.user.tag, reason));
        } catch (err) {
            await msg.say(this.client.translate('commands.error', err.message));
        }
    }
};