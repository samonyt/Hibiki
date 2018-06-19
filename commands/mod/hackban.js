const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Hackban extends Command {
    constructor(client) {
        super(client, {
            name: 'hackban',
            group: 'mod',
            memberName: 'hackban',
            description: 'Hackbans a user when executed.',
            examples: ['hackban 334254548841398275'],
            guildOnly: true,
            args: [{
                key: 'id',
                prompt: 'Which user do you want to hackban?\n',
                type: 'user'
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
        const user = this.client.users.get(id);
        if (!msg.guild.me.permissions.has('BAN_MEMBERS')) return msg.say(this.client.translate('commands.ban.me.noPerms'));
        const modlog = await msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlog) return msg.say(this.client.translate('commands.noModLog', msg.guild.commandPrefix));
        try {
            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setDescription(this.client.translate('commands.hackban.embed.response', user ? user.tag : 'I was unable to display the user :(', user.id), msg.author.tag, reason);
            await msg.guild.members.ban(id, { days: 0, reason });
            await modlog.send({ embed });
            await msg.say(this.client.translate('commands.hackban.response', user.tag, reason));
        } catch (err) {
            await msg.say(this.client.translate('commands.error', err.message));
        }
    }
};