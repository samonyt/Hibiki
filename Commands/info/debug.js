const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const os = require('os');

module.exports = class Debug extends Command {
    constructor(client) {
        super(client, {
            name: 'debug',
            group: 'info',
            memberName: 'debug',
            description: 'Debug information about this bot.',
            guarded: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    run(msg) {
        return msg.say(stripIndents`
        \`\`\`asciidoc\n
        = Debug =

        [Debug information about ${this.client.user.username}.]

        == User ==
        • ID :: ${this.client.user.id}
        • User :: ${this.client.user.tag}
        • Version :: v${this.client.version}

        == OS ==
        • Memory usage :: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
        • CPU :: ${os.cpus()[1].model}

        • Total memory :: ${this.client.modules.ConvertBytes(os.freemem())} / ${this.client.modules.ConvertBytes(os.totalmem())}

        • Home Directory :: ${os.userInfo().homedir}
        • Temp Directory :: ${os.tmpdir()}

        == Versions ==

        • Node.js :: ${process.version}
        • discord.js :: ${require('discord.js/package.json').version}
        • discord.js-commando :: ${require('discord.js-commando/package.json').version}

        \`\`\`
        `);
    }
};
