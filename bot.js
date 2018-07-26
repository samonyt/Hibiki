const { FriendlyError } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { error, info } = require('winston');

const { 
    blacklistMessage, commandPrefix, disableEveryone, invite, owner, unknownCommandResponse 
} = require('./Config');

const Client = require('./Structures/Hibiki');
const SequelizeProvider = require('./Providers/Sequelize');

const Hibiki = new Client({ 
    commandPrefix, disableEveryone, invite, owner, unknownCommandResponse
});

Hibiki.start();
Hibiki.setProvider(new SequelizeProvider(Hibiki.database)).catch(error);

Hibiki.dispatcher.addInhibitor(msg => {
    const blacklist = Hibiki.provider.get('global', 'blacklistUsers', []);
    if (!blacklist.includes(msg.author.id)) return false;
    const message = blacklistMessage
        .replace(/(<user>)/, msg.author.username)
        .replace(/(<bot>)/, Hibiki.user.username)
        .replace(/(<owner>)/, Hibiki.users.get(Hibiki.options.owner).tag);
    return msg.say(message);
});

Hibiki
    .on('message', (msg) => {
        if (!msg.guild || !msg.guild.settings.get('antiInvite')) return;
            
        if (/(discord(\.gg\/|app\.com\/invite\/|\.me\/))/gi.test(msg.content)) {
            if (msg.author.bot || msg.member.permissions.has('MANAGE_SERVER') || msg.member.roles.has(msg.guild.settings.get('antiInviteRole'))) return;
            if (!msg.channel.permissionsFor(Hibiki.user).has(['SEND_MESSAGES', 'MANAGE_MESSAGES'])) return;
            msg.delete();
            msg.say(`Anti-invite has been turned on for ${msg.guild.name}. You can't post any invites.`);
        }
    })
    .on('commandRun', (cmd, promise, msg, args) => {
        Hibiki.cmdsUsed++;
        info(oneLine`
                [COMMAND RUN]:
                ${msg.author.tag} (${msg.author.id})
                > ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'PM'}
                >> ${cmd.groupID}:${cmd.memberName}
                ${Object.values(args).length ? `>>> ${Object.values(args)}` : ''}
        `);
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof FriendlyError) return;
        error(`[COMMAND ERROR]: Error in command ${cmd.groupID}:${cmd.memberName}.`, err);
    })
    .on('commandBlocked', (msg, reason) => {
        error(oneLine`
            [COMMAND BLOCK]:
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; User ${msg.author.tag} (${msg.author.id}): ${reason}.
        `);
    })
    .on('commandPrefixChange', (guild, prefix) => {
        info(oneLine`
            [PREFIX CHANGE]:
			Prefix changed to ${prefix || 'the default'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
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