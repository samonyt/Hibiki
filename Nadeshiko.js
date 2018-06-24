const { FriendlyError } = require('discord.js-commando');
const { MongoClient } = require('mongodb');
const { oneLine } = require('common-tags');
const { error, info } = require('winston');

const Client = require('./Client/');
const Provider = require('./Providers/MongoDB');
const config = require('./Config');

const Nadeshiko = new Client({
    owner: config.owner,
    commandPrefix: config.prefix,
    invite: config.invite,
    unknownCommandResponse: false,
    disableEveryone: true
});

info('[DATABASE]: Initializing MongoDB..');
Nadeshiko.setProvider(MongoClient.connect(config.dbURL).then(client => new Provider(client.db(config.dbName)))).catch(error);
info('[DATABASE]: Initialized!');
Nadeshiko.start();

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
        info(oneLine`
                [COMMAND RUN]:
                ${msg.author.tag} (${msg.author.id})
                > ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'PM'}
                >> ${cmd.groupID}:${cmd.memberName}
                ${Object.values(args).length ? `>>> ${Object.values(args)}` : ''}
        `);
        Nadeshiko.webhook.send(`\`[${new Date().toLocaleString()}]\` Command \`${cmd.groupID}:${cmd.memberName}\` ran by \`${msg.author.tag}\` (\`${msg.author.id}\`) on \`${msg.guild.name}\` (\`${msg.guild.id}\`).`);
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof FriendlyError) return;
        error(`[COMMAND ERROR]: Error in command ${cmd.groupID}:${cmd.memberName}.`, err);
        Nadeshiko.webhook.send(`\`[${new Date().toLocaleString()}]\` Command \`${cmd.groupID}:${cmd.memberName}\` errored.\n\`\`\`${err.stack}\`\`\``);
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