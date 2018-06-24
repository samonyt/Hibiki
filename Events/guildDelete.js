const { MessageEmbed } = require('discord.js');
const { info } = require('winston');
const { guildLog } = require('../Config');

module.exports = async (client, guild) => {
    const embed = new MessageEmbed()
        .setTitle(`Server left! ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .setColor(0xff0000)
        .setFooter(`${client.user.username} is now in ${client.guilds.size} servers. | v${client.version}`)
        .addField('Name', guild.name, true)
        .addField('ID', guild.id, true)
        .addField('Owner', `\`${guild.owner.user.tag}\` (\`${guild.owner.user.id}\`)`, true)
        .addField('Member count', guild.memberCount, true)
        .addField('Created at', `\`${guild.createdAt.toLocaleString()}\``, true);
    await client.channels.get(guildLog).send({ embed });
    await info(`[GUILD LEFT]: ${guild.name} (${guild.id})`);
    await client.webhook.send(`\`[${new Date().toLocaleString()}]\` Left guild ${guild.name} (${guild.id}, see ${client.channels.get(guildLog.opts.ids.log)} for more info.`);
};