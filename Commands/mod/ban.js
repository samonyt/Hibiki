const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { error } = require('winston');

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
        return this.client.isOwner(msg.author) || this.client.modules.IsStaff(msg.member);
    }

    async run(msg, { member, reason } ) {
        if (!msg.guild.me.permissions.has('BAN_MEMBERS')) 
            return msg.say('Sorry, I don\'t have permissions to ban people.');
        const modlog = await msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlog) 
            return msg.say(`No moderation log channel set. Type \`${msg.guild.commandPrefix} mod-log #channel\` to set it.`);
        try {
            const resp = await this.client.modules.AwaitReply(msg, `Do you really want to ban **${member}**?\nRespond with "yes" or "no".`, 30000);
            if (['y', 'yes'].includes(resp.toLowerCase())) {
                const embed = new MessageEmbed()
                    .setColor(0xff0000)
                    .setDescription(`🔨 | **User banned**: ${member}\n**Issuer**: ${msg.author.tag}\n**Reason**: ${reason}`);
                await member.ban({ reason });
                await modlog.send({ embed });
                await msg.react('✅');
            } else if (['n', 'no', 'cancel'].includes(resp.toLowerCase())) {
                return msg.say('Cancelled the ban.');
            }
        } catch (err) {
            await error(err.stack);
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};