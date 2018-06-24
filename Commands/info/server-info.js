const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const filterLevels = ['Off', 'No Role', 'Everyone'];
const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];

module.exports = class ServerInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'server-info',
            aliases: ['guild-info', 'guild', 'server'],
            group: 'info',
            memberName: 'server-info',
            description: 'Retrieves server information.\n',
            guildOnly: true
        });
    }
    run(msg) {
        const embed = new MessageEmbed()
            .setThumbnail(msg.guild.iconURL({ size: 2048 }))
            .setColor(0x0E2F44)
            .addField(this.client.translate('commands.server.name'),
                `${msg.guild.name}`, true)
            .addField(this.client.translate('commands.server.id'),
                `${msg.guild.id}`, true)
            .addField(this.client.translate('commands.server.createdAt'),
                `${moment.utc(msg.guild.createdAt).format('MMMM Do YYYY, HH:mm:ss')}`, true)
            .addField(this.client.translate('commands.server.region'),
                `${this.client.modules.Region(msg.guild.region)}`, true)
            .addField(this.client.translate('commands.server.owner'),
                `${this.client.users.get(msg.guild.ownerID).tag} 👑`, true)
            .addField(this.client.translate('commands.server.members'),
                `${msg.guild.memberCount}`, true)
            .addField(this.client.translate('commands.server.roles'),
                `${msg.guild.roles.size}`, true)
            .addField(this.client.translate('commands.server.channels'),
                `${msg.guild.channels.size}`, true)
            .addField(this.client.translate('commands.server.filter'),
                `${filterLevels[msg.guild.explicitContentFilter]}`, true)
            .addField(this.client.translate('commands.server.verifLevel'),
                `${verificationLevels[msg.guild.verificationLevel]}`, true)
            .addField(this.client.translate('commands.server.afk'),
                `${msg.guild.afkChannelID ? `<#${msg.guild.afkChannelID}> after ${msg.guild.afkTimeout / 60}min` : 'None'}`, true);
        return msg.embed(embed);

    }
};