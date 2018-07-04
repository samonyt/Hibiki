const { CommandoClient } = require('discord.js-commando');
const { WebhookClient } = require('discord.js');
const { readdirSync } = require('fs');
const { version } = require('../package');
const { join } = require('path');
const { error, info } = require('winston');
const { color, webhookID, webhookToken, token } = require('../Config');

const Webserver = require('../Webserver/Server');
const Command = require('../Managers/Command');
const Event = require('../Managers/Event');
const i18n = require('i18n');

module.exports = class Nadeshiko extends CommandoClient {
    constructor (options) {
        super (options);
        this.modules = {};
        this.color = color;
        this.cmdsUsed = 0;
        this.commands = this.registry.commands;
        this.version = version;
        this.webhook = new WebhookClient(webhookID, webhookToken);
        this.locale = i18n;
        this.translate = this.locale.__;

        for (const module of readdirSync('./Modules/')) {
            const moduleName = module.split('.')[0];
            this.modules[moduleName] = require(`../Modules/${moduleName}`);
        }

        this.encryptor = new this.modules.Encryption();

        process.on('unhandledRejection', err => {
            if (error.code && (error.code === 50006 || error.code === 50007 || error.code === 50013)) return;
            error(`[UNHANDLED PROMISE REJECTION]:\n${err.stack}`);
        });

    }

    async i18n () {
        i18n.configure({
            autoReload: true,
            cookie: 'locale',
            defaultLocale: 'en-gb',
            directory: join(__dirname, '..', 'Locales'),
            updateFiles: false,
        });
    }

    async start () {
        await info('[COMMAND HANDLER]: Initializing command handler..');
        await Command(this);
        await info('[COMMAND HANDLER]: Initialized!');

        await info('[EVENT HANDLER]: Initializing event handler..');
        await Event(this);
        await info('[EVENT HANDLER]: Initialized!');

        await info('[WEBSERVER]: Initializing webserver..');
        await Webserver(this);
        
        await info('[DISCORD]: Connecting to Discord..');
        await this.login(token);
        await this.i18n();
    }
};