const { FriendlyError } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { MongoClient: Mongo } = require('mongodb');
const { oneLine } = require('common-tags');
const { error, info } = require('winston');
const { commandPrefix, dbName, dbURL, disableEveryone, invite, owner, unknownCommandResponse } = require('./Config');

const Client = require('./Client/');
const Provider = require('./Providers/MongoDB');

const Nadeshiko = new Client({ owner, commandPrefix, invite, unknownCommandResponse, disableEveryone });
Nadeshiko.start();

Nadeshiko.dispatcher.addInhibitor(msg => {
    const blacklist = Nadeshiko.provider.get('global', 'blacklistUsers', []);
    if (!blacklist.includes(msg.author.id)) return false;
    return msg.say(`❎ | Sorry, it seems that you're blacklisted from using **${Nadeshiko.user.username}**. Contact **${Nadeshiko.users.get(Nadeshiko.options.owner).tag}** for more details.`);
});

Nadeshiko
    .on('message', (msg) => {
        if (!msg.guild || !msg.guild.settings.get('antiInvite')) return;
        if (/(discord(\.gg\/|app\.com\/invite\/|\.me\/))/gi.test(msg.content)) {
            if (msg.author.bot || msg.member.permissions.has('MANAGE_SERVER') || msg.member.roles.has(msg.guild.settings.get('antiInviteRole'))) return;
            if (!msg.channel.permissionsFor(Nadeshiko.user).has(['SEND_MESSAGES', 'MANAGE_MESSAGES'])) return;
            msg.delete();
            msg.say(`Anti-invite has been turned on for ${msg.guild.name}. You can't post any invites.`);
        }
    })
    .on('commandRun', (cmd, promise, msg, args) => {
        Nadeshiko.cmdsUsed++;
        info(oneLine`
                [COMMAND RUN]:
                ${msg.author.tag} (${msg.author.id})
                > ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'PM'}
                >> ${cmd.groupID}:${cmd.memberName}
                ${Object.values(args).length ? `>>> ${Object.values(args)}` : ''}
        `);
        const embed = new MessageEmbed()
            .setColor(Nadeshiko.color)
            .setTitle('`ℹ` Command Run')
            .setFooter(`Command ran by ${msg.author.tag} (${msg.author.id}) | ${new Date().toLocaleString()}`, msg.author.displayAvatarURL({ format: 'png'}))
            .addField('Name', cmd.memberName, true)
            .addField('Category', cmd.groupID, true);
        Object.values(args).length ? embed.addField('Arguments', Object.values(args)) : '';
        Nadeshiko.webhook.send(embed);
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof FriendlyError) return;
        error(`[COMMAND ERROR]: Error in command ${cmd.groupID}:${cmd.memberName}.`, err);
        const embed = new MessageEmbed()
            .setColor(0xFF0000)
            .setTitle('Command Error')
            .setFooter(new Date().toLocaleString())
            .addField('Name', cmd.memberName, true)
            .addField('Category', cmd.groupID, true)
            .addField('Error', `\`\`\`${err.stack}\`\`\``, true);
        Nadeshiko.webhook.send(embed);
    })
    .on('commandBlocked', (msg, reason) => {
        error(oneLine`
            [COMMAND BLOCK]:
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; User ${msg.author.tag} (${msg.author.id}): ${reason}.
        `);
        Nadeshiko.webhook.send(`\`[${new Date().toLocaleString()}]\` Command \`${msg.command.groupID}:${msg.command.memberName}\` blocked.\nUser: \`${msg.author.tag}\` (\`${msg.author.id}\`)\nReason: \`${reason}\``);
    })
    .on('commandPrefixChange', (guild, prefix) => {
        info(oneLine`
            [PREFIX CHANGE]:
			Prefix changed to ${prefix || 'the default'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
        Nadeshiko.webhook.send(`\`[${new Date().toLocaleString()}]\` Prefix changed to ${prefix || 'the default'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        info(oneLine`
            [COMMAND STATUS CHANGE]:
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        info(oneLine`
            [GROUP STATUS CHANGE]
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
    });

info('[DATABASE]: Initializing MongoDB..');
Nadeshiko.setProvider(Mongo.connect(dbURL, { useNewUrlParser: true })
    .then(client => new Provider(client.db(dbName))))
    .catch(error);
info('[DATABASE]: Initialized!');