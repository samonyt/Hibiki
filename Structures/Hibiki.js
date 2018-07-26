const { CommandoClient } = require('discord.js-commando');
const { readdirSync } = require('fs');
const { version } = require('../package');
const { error, info } = require('winston');
const { color, token } = require('../Config');

const Database = require('../Structures/PostgreSQL');
const Webserver = require('../Webserver/Server');
const Command = require('../Handlers/Command');
const Event = require('../Handlers/Event');

module.exports = class Hibiki extends CommandoClient {
    constructor (options) {
        super (options);
        this.color = color;
        this.commands = this.registry.commands;
        this.cmdsUsed = 0;
        this.database = Database.db;
        this.modules = {};
        this.version = `v${version}`;

        for (const module of readdirSync('./Modules/')) {
            const moduleName = module.split('.')[0];
            this.modules[moduleName] = require(`../Modules/${moduleName}`);
        }

        this.encryptor = new this.modules.Encryption();

        process.on('unhandledRejection', err => {
            if (error.code === 50006 || error.code === 50007 || error.code === 50013) return;
            error(`[UNHANDLED PROMISE REJECTION]:\n${err.stack}`);
        });

    }

    async dbInit () {
        await Database.start();
    }

    async start () {
        await info('[COMMAND HANDLER]: Loading command handler..');
        await Command(this);
        await info('[COMMAND HANDLER]: Loaded.');

        await info('[EVENT HANDLER]: Loading event handler..');
        await Event(this);
        await info('[EVENT HANDLER]: Succesfully loaded.');

        await info('[WEBSERVER]: Starting webserver..');
        await Webserver(this);

        await this.dbInit();
        
        await info('[DISCORD]: Connecting to Discord..');
        await this.login(token);
    }
};