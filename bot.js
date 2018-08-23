const { FriendlyError } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const Raven = require('raven');

const { 
    blacklistMessage, commandPrefix, disableEveryone, invite, owner, unknownCommandResponse, sentry 
} = require('./Config');

const Client = require('./Structures/Hibiki');
const SequelizeProvider = require('./Providers/Sequelize');

const Currency = require('./Structures/Currency');
const Experience = require('./Structures/Experience');

let earnedRecently = [];
let gainedXPRecently = [];

const Hibiki = new Client({ 
    commandPrefix, disableEveryone, invite, owner, unknownCommandResponse
});

Hibiki.start();

if (sentry) {
    Raven.config(sentry).install();
}

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
    .once('ready', () => Currency.leaderboard())
    .on('message', async (msg) => {
        if (!msg.guild || !msg.guild.settings.get('antiInvite')) return;
        if (msg.author.bot) return;
            
        if (/(discord(\.gg\/|app\.com\/invite\/|\.me\/))/gi.test(msg.content)) {
            if (msg.author.bot || msg.member.permissions.has('MANAGE_SERVER') || msg.member.roles.has(msg.guild.settings.get('antiInviteRole'))) return;
            if (!msg.channel.permissionsFor(Hibiki.user).has(['SEND_MESSAGES', 'MANAGE_MESSAGES'])) return;
            msg.delete();
            msg.say(`Anti-invite has been turned on for ${msg.guild.name}. You can't post any invites.`);
        }
        const channelLocks = Hibiki.provider.get(msg.guild.id, 'locks', []);
        if (channelLocks.includes(msg.channel.id)) return;
        if (!earnedRecently.includes(msg.author.id)) {
            const hasImageAttachment = msg.attachments.some(attachment =>
                attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/)
            );
            const moneyEarned = hasImageAttachment
                ? Math.ceil(Math.random() * 7) + 5
                : Math.ceil(Math.random() * 7) + 1;

            Currency._changeBalance(msg.author.id, moneyEarned);

            earnedRecently.push(msg.author.id);
            setTimeout(() => {
                const index = earnedRecently.indexOf(msg.author.id);
                earnedRecently.splice(index, 1);
            }, 8000);
        }

        if (!gainedXPRecently.includes(msg.author.id)) {
            const xpEarned = Math.ceil(Math.random() * 9) + 3;
            const oldLevel = await Experience.getLevel(msg.author.id);

            Experience.addExperience(msg.author.id, xpEarned).then(async () => {
                const newLevel = await Experience.getLevel(msg.author.id);
                if (newLevel > oldLevel) {
                    Currency._changeBalance(msg.author.id, 100 * newLevel);
                }
            }).catch(err => null); // eslint-disable-line no-unused-vars, handle-callback-err

            gainedXPRecently.push(msg.author.id);
            setTimeout(() => {
                const index = gainedXPRecently.indexOf(msg.author.id);
                gainedXPRecently.splice(index, 1);
            }, 60 * 1000);
        }
    })
    .on('commandRun', (cmd, promise, msg, args) => {
        Hibiki.cmdsUsed++;
        Hibiki.logger.info(oneLine`
                [COMMAND RUN]:
                ${msg.author.tag} (${msg.author.id})
                > ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'PM'}
                >> ${cmd.groupID}:${cmd.memberName}
                ${Object.values(args).length ? `>>> ${Object.values(args)}` : ''}
        `);
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof FriendlyError) return;
        Hibiki.logger.error(`[COMMAND ERROR]: Error in command ${cmd.groupID}:${cmd.memberName}.`, err);
    })
    .on('commandBlocked', (msg, reason) => {
        Hibiki.logger.error(oneLine`
            [COMMAND BLOCK]:
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; User ${msg.author.tag} (${msg.author.id}): ${reason}.
        `);
    })
    .on('commandPrefixChange', (guild, prefix) => {
        Hibiki.logger.info(oneLine`
            [PREFIX CHANGE]:
			Prefix changed to ${prefix || 'the default'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        Hibiki.logger.info(oneLine`
            [COMMAND STATUS CHANGE]:
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        Hibiki.logger.info(oneLine`
            [GROUP STATUS CHANGE]
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
    });

Hibiki.setProvider(new SequelizeProvider(Hibiki.database)).catch(Hibiki.logger.error);