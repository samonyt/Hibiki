const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Unban extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: ['unbanne'],
            group: 'mod',
            memberName: 'unban',
            description: 'Unbans a user when executed.',
            examples: ['unban 334254548841398275'],
            guildOnly: true,
            args: [{
                key: 'id',
                prompt: 'Which user ID do you want to unban?\n',
                type: 'string'
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

    async run(msg, { id, reason } ) {
        const modlog = await msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlog) return msg.say(this.client.translate('commands.noModLog', msg.guild.commandPrefix));
        const bans = await msg.guild.fetchBans();
        if (!bans.has(id)) return msg.say(this.client.translate('commands.unban.notBanned'));
        const member = bans.get(id).user;
        try {
            await this.client.users.get(id).send(this.client.translate('commands.unban.response', msg.guild.name, reason));
            await msg.guild.members.unban(member, { reason });
            const embed = new MessageEmbed()
                .setColor(0x00ff00)
                .setDescription(this.client.translate('commands.unban.embed.response', member.user.tag, msg.author.tag, reason));
            await modlog.send({ embed });
            await msg.say(this.client.translate('commands.unban.response', member.username, reason));
        } catch (err) {
            await msg.say(this.client.translate('commands.error', err.message));
        }
    }
};