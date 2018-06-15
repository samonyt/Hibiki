const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { info } = require("winston");
const config = require("../config");

module.exports = async (Rin, guild) => {
    const embed = new MessageEmbed()
        .setTitle(`New guild! ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .setColor(0x00ff00)
        .setFooter(`Rin is now in ${Rin.guilds.size} servers. | v${Rin.version}`)
        .addField("Name", guild.name, true)
        .addField("ID", guild.id, true)
        .addField("Owner", `\`${guild.owner.user.tag}\` (\`${guild.owner.user.id}\`)`, true)
        .addField("Member count", guild.memberCount, true)
        .addField("Created at", `\`${guild.createdAt.toLocaleString()}\``, true);
    await Rin.channels.get(config.opts.ids.log).send({ embed });
    await guild.owner.send(stripIndents`
            Thank you for inviting me to \`${guild.name}\`!
            My prefix is \`${Rin.commandPrefix}\`. To change it, type \`${Rin.commandPrefix}prefix <prefix>\`.

            View all commands by typing \`${Rin.commandPrefix}help\`.
`);
    await info(`[NEW GUILD]: ${guild.name} (${guild.id})`);
    await Rin.webhook.send(`\`[${new Date().toLocaleString()}]\` New guild ${guild.name} (${guild.id}, see ${Rin.channels.get(config.opts.ids.log)} for more info.`);
};