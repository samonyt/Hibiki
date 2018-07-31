const { CommandoClient } = require('discord.js-commando');
const { readdirSync } = require('fs');
const { version } = require('../package');
const { color, token } = require('../Config');

const winston = require('winston');
const Database = require('../Structures/PostgreSQL');
const Redis = require('./Redis');
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
        this.logger = winston;
        this.modules = {};
        this.redis = Redis.db;
        this.version = `v${version}`;

        for (const module of readdirSync('./Modules/')) {
            const moduleName = module.split('.')[0];
            this.modules[moduleName] = require(`../Modules/${moduleName}`);
        }

        this.encryptor = new this.modules.Encryption();

        process.on('unhandledRejection', err => {
            if (err.code === 50006 || err.code === 50007 || err.code === 50013) return;
            this.logger.error(`[UNHANDLED PROMISE REJECTION]:\n${err.stack}`);
        });

    }

    async dbInit () {
        await Database.start();
        await Redis.start();
    }

    async start () {
        await this.logger.info('[COMMAND HANDLER]: Loading command handler..');
        await Command(this);
        await this.logger.info('[COMMAND HANDLER]: Loaded.');

        await this.logger.info('[EVENT HANDLER]: Loading event handler..');
        await Event(this);
        await this.logger.info('[EVENT HANDLER]: Succesfully loaded.');

        await this.logger.info('[WEBSERVER]: Starting webserver..');
        await Webserver(this);

        await this.dbInit();
        
        await this.logger.info('[DISCORD]: Connecting to Discord..');
        await this.login(token);
    }
};