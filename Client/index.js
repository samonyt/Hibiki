const { CommandoClient } = require('discord.js-commando');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { readdir, readdirSync } = require('fs');
const { stripIndents } = require('common-tags');
const { version } = require('../package');
const { join } = require('path');
const { error, info } = require('winston');

const ws = require('../Webserver/Server');

const i18n = require('i18n');
const config = require('../Config');
const modules = readdirSync('./Modules/');

i18n.configure({
    autoReload: true,
    cookie: 'locale',
    defaultLocale: 'en-gb',
    directory: join(__dirname, '..', 'Locales'),
    updateFiles: false,
});

module.exports = class Nadeshiko extends CommandoClient {
    constructor (options) {
        super (options);
        this.modules = {};
        this.config = config;
        this.color = config.color;
        this.commands = this.registry.commands;
        this.version = version;
        this.webhook = new WebhookClient(config.webhookID, config.webhookToken);
        this.locale = i18n;
        this.translate = this.locale.__;
                
        process.on('unhandledRejection', err => {
            if (error.code && (error.code === 50006 || error.code === 50007 || error.code === 50013)) return;
            error(`[UNHANDLED PROMISE REJECTION]:\n${err.stack}`);
        });

        if (config.shutdown === true) {
            error('[CONFIG]: shutdown set to true; terminating the process..');
            process.exit(0);
        }

        for (const module of modules) {
            const moduleName = module.split('.')[0];
            this.modules[moduleName] = require(`../Modules/${moduleName}`);
        }

        this.encryptor = this.modules.Encryption(config.encryptionKey);

    }

    async modDM ([ action, actionPT ], guild, user, issuer, reason) {
        const color = ({
            ban: 0xFF0000,
            softban: 0xFF0000,
            kick: 0xFFFF00,
            unban: 0x00FF00
        })[action];

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`You were ${actionPT} from ${guild}.`)
            .addField('Issuer', issuer, true)
            .addField('Reason', reason, true)
            .setTimestamp();
        return user.send({ embed });
    }

    async dm (user, content) {
        return user.send(content);
    }

    async start () {
        await info('[INHIBITOR]: Initializing inhibitor..');
        await this.dispatcher.addInhibitor(msg => {
            const blacklist = this.provider.get('global', 'blacklistUsers', []);

            if (!blacklist.includes(msg.author.id)) return false;
            return msg.say(stripIndents`
            ❎ | Sorry, it seems that you're blacklisted from using ${this.user.tag}. Contact ${this.options.owner.user.tag} for more details.
            `);
        });
        await info('[INHIBITOR]: Initialized!');
        await info('[COMMAND HANDLER]: Initializing command handler..');
        await this.registry
            .registerDefaultTypes()
            .registerTypesIn(join(__dirname, '..', 'Types'))
            .registerGroups([
                ['analyze', 'Analyzation'],
                ['fun', 'Fun'],
                ['games', 'Games'],
                ['image', 'Images'],
                ['image-edit', 'Image editing'],
                ['info', 'Information'],
                ['mod', 'Moderation'],
                ['nsfw', 'NSFW'],
                ['owner', 'Owner-only'],
                ['roleplay', 'Roleplay'],
                ['search', 'Search'],
                ['settings', 'Settings'],
                ['tags', 'Tagging'],
                ['text', 'Text editing'],
                ['util', 'Utility']
            ])
            .registerDefaultCommands({
                help: false,
                eval: false,
                ping: false,
                prefix: false,
                commandState: false
            })
            .registerCommandsIn(join(__dirname, '..', 'Commands'));
        await info('[COMMAND HANDLER]: Initialized!');
        
        await info('[EVENT HANDLER]: Initializing event handler..');
        readdir('./events/', (err, files) => {
            if (err) return error(err);
            files.forEach(file => {
                const event = require(`../Events/${file}`);
                let eventName = file.split('.')[0];
                this.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(`../Events/${file}`)];
            });
        });
        await info('[EVENT HANDLER]: Initialized!');
        await info('[WEBSERVER]: Initializing webserver..');
        await ws(this);
        await info('[DISCORD]: Connecting to Discord..');
        this.login(config.token);
    }
};