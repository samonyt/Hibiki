const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['ban-hammer', 'banne'],
            group: 'mod',
            memberName: 'ban',
            description: 'Bans a user when executed.',
            examples: ['ban @User#1234'],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'Which user do you want to ban?\n',
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

    async run(msg, { member,reason } ) {
        if (!msg.guild.me.permissions.has('BAN_MEMBERS')) return msg.say(this.client.translate('commands.ban.me.noPerms'));
        const modlog = await msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlog) return msg.say(this.client.translate('commands.noModLog', msg.guild.commandPrefix));
        try {
            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setDescription(this.client.translate('commands.ban.embed.response', member.user.tag, msg.author.tag, reason));
            await this.client.modDM(['ban', 'banned'], msg.guild, member.user, msg.author, reason);
            await member.ban({ days: 0, reason });
            await modlog.send({ embed });
            await msg.say(this.client.translate('commands.ban.response', member.user.tag, reason));
        } catch (err) {
            await msg.say(this.client.translate('commands.error', err.message));
        }
    }
};