const { CommandoClient } = require("discord.js-commando");
const { MessageEmbed, WebhookClient } = require("discord.js");
const { readdir, readdirSync } = require("fs");
const { stripIndents } = require("common-tags");
const { version } = require("../package");
const { join } = require("path");
const { error, info } = require("winston");

const ws = require("../web/app");

const i18n = require("i18n");
const utils = readdirSync("./utils/");
const config = require("../config");

i18n.configure({
    autoReload: true,
    cookie: "locale",
    defaultLocale: "en-gb",
    directory: join(__dirname, "..", "locales"),
    updateFiles: false,
});

module.exports = class RinClient extends CommandoClient {
    constructor (options) {
        super (options);
        this.color = 0x4F5F83;
        this.config = config;
        this.commands = this.registry.commands;
        this.version = version;
        this.webhook = new WebhookClient(config.keys.webhook.id, config.keys.webhook.token);
        this.locale = i18n;
        this.translate = this.locale.__;
                
        if (config.opts.shutdown === true) {
            error("[CONFIG]: Shutdown at start set to yes, halting instance.");
            process.exit(0);
        }

        this.utils = {};

        for (const util of utils) {
            const uN = util.split(".")[0];
            this.utils[uN] = require(`../utils/${uN}`);
        }

        this.encryptor = this.utils.Encryption(config.keys.encrypt);

        process.on("unhandledRejection", err => {
            error(`[ERROR]: Unhandled Promise rejection:\n${err.stack}`);
        });
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
            .addField("Issuer", issuer, true)
            .addField("Reason", reason, true);
        return user.send({ embed });
    }
    async dm (user, content) {
        return user.send(content);
    }
    async bind () {
        await info("[INHIBITOR]: Initializing inhibitor..");
        await this.dispatcher.addInhibitor(msg => {
            const blacklist = this.provider.get("global", "blacklistUsers", []);

            if (!blacklist.includes(msg.author.id)) return false;
            return msg.say(stripIndents`
            ❎ | Sorry, it seems that you're blacklisted from using ${this.user.tag}. Contact ${this.options.owner.user.tag} for more details.
            `);
        });
        await info("[INHIBITOR]: Initialized!");
        await info("[COMMAND HANDLER]: Initializing command handler..");
        await this.registry
            .registerDefaultTypes()
            .registerTypesIn(join(__dirname, "..", "types"))
            .registerGroups([
                ["analyze", "Analyzation"],
                ["fun", "Fun"],
                ["games", "Games"],
                ["image", "Image editing"],
                ["info", "Information"],
                ["mod", "Moderation"],
                ["owner", "Owner-only"],
                ["roleplay", "Roleplay"],
                ["search", "Search"],
                ["settings", "Settings"],
                ["tags", "Tagging"],
                ["text", "Text editing"],
                ["util", "Utility"]
            ])
            .registerDefaultCommands({
                help: false,
                eval: false,
                ping: false,
                prefix: false,
                commandState: false
            })
            .registerCommandsIn(join(__dirname, "..", "commands"));
        await info("[COMMAND HANDLER]: Initialized!");
        
        await info("[EVENT HANDLER]: Initializing event handler..");
        readdir("./events/", (err, files) => {
            if (err) return error(err);
            files.forEach(file => {
                const event = require(`../events/${file}`);
                let eventName = file.split(".")[0];
                this.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(`../events/${file}`)];
            });
        });
        await info("[EVENT HANDLER]: Initialized!");
        await info("[WEBSERVER]: Initializing webserver..");
        await ws(this);
        await info("[DISCORD]: Connecting to Discord..");
        this.login(config.keys.token);
    }
};