const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { guildLog } = require('../Config');

module.exports = async (client, guild) => {
    const embed = new MessageEmbed()
        .setTitle(`New guild! ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .setColor(0x00ff00)
        .setFooter(`${client.user.username} is now in ${client.guilds.size} servers. | v${client.version}`)
        .addField('Name', guild.name, true)
        .addField('ID', guild.id, true)
        .addField('Owner', `\`${guild.owner.user.tag}\` (\`${guild.owner.user.id}\`)`, true)
        .addField('Member count', guild.memberCount, true)
        .addField('Created at', `\`${guild.createdAt.toLocaleString()}\``, true);
    await client.channels.get(guildLog).send({ embed });
    await guild.owner.send(stripIndents`
            Thank you for inviting me to \`${guild.name}\`!
            My prefix is \`${client.commandPrefix}\`. To change it, type \`${client.commandPrefix}prefix <prefix>\`.

            View all commands by typing \`${client.commandPrefix}help\`.
`);
    await client.logger.info(`[NEW GUILD]: ${guild.name} (${guild.id})`);
};