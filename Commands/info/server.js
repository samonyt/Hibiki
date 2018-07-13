const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const filterLevels = ['Off', 'No Role', 'Everyone'];
const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];

module.exports = class Server extends Command {
    constructor(client) {
        super(client, {
            name: 'server',
            aliases: ['server-info', 'guild-info', 'guild'],
            group: 'info',
            memberName: 'server-info',
            description: 'Retrieves server information.\n',
            guildOnly: true
        });
    }
    run(msg) {
        const embed = new MessageEmbed()
            .setThumbnail(msg.guild.iconURL({ size: 2048 }))
            .setColor(this.client.color)
            .addField('❯ Server Name',
                `${msg.guild.name}`, true)
            .addField('❯ Server ID',
                `${msg.guild.id}`, true)
            .addField('❯ Created at',
                `${moment.utc(msg.guild.createdAt).format('MMMM Do YYYY, HH:mm:ss')}`, true)
            .addField('❯ Server region',
                `${this.client.modules.Region(msg.guild.region)}`, true)
            .addField('❯ Server owner',
                `${this.client.users.get(msg.guild.ownerID).tag} 👑`, true)
            .addField('❯ Members',
                `${msg.guild.memberCount}`, true)
            .addField('❯ Roles',
                `${msg.guild.roles.size}`, true)
            .addField('❯ Channels',
                `${msg.guild.channels.size}`, true)
            .addField('❯ Server filter',
                `${filterLevels[msg.guild.explicitContentFilter]}`, true)
            .addField('❯ Server verification level',
                `${verificationLevels[msg.guild.verificationLevel]}`, true)
            .addField('❯ AFK channel',
                `${msg.guild.afkChannelID ? `<#${msg.guild.afkChannelID}> after ${msg.guild.afkTimeout / 60}min` : 'None'}`, true);
        return msg.embed(embed);

    }
};