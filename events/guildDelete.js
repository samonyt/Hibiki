const { MessageEmbed } = require("discord.js");
const { info } = require("winston");
const config = require("../config");

module.exports = async (Rin, guild) => {
    const embed = new MessageEmbed()
        .setTitle(`Server left! ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .setColor(0xff0000)
        .setFooter(`Rin is now in ${Rin.guilds.size} servers. | v${Rin.version}`)
        .addField("Name", guild.name, true)
        .addField("ID", guild.id, true)
        .addField("Owner", `\`${guild.owner.user.tag}\` (\`${guild.owner.user.id}\`)`, true)
        .addField("Member count", guild.memberCount, true)
        .addField("Created at", `\`${guild.createdAt.toLocaleString()}\``, true);
    await Rin.channels.get(config.opts.ids.log).send({ embed });
    await info(`[GUILD LEFT]: ${guild.name} (${guild.id})`);
    await Rin.webhook.send(`\`[${new Date().toLocaleString()}]\` Left guild ${guild.name} (${guild.id}, see ${Rin.channels.get(config.opts.ids.log)} for more info.`);
};