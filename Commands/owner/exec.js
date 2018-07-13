const { Command } = require('discord.js-commando');
const { exec } = require('child_process');
const { stripIndents } = require('common-tags');

module.exports = class Exec extends Command {
    constructor(client) {
        super(client, {
            name: 'exec',
            aliases: ['execute'],
            group: 'owner',
            memberName: 'exec',
            description: 'Executes a command in shell.',
            details: 'Only the bot owner can use this command.',
            examples: ['exec <shell command>'],
            args: [{
                key: 'code',
                prompt: 'What would you like to execute?\n',
                type: 'string'
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(msg, args) {
        exec(args.code, (err, stdout) => {
            if (err) {
                return msg.say(stripIndents`
                🚫 **Error**
                \`\`\`${err.message}\`\`\`
                `);
            }
            return msg.say(stripIndents`
                ℹ **Output**
                \`\`\`${stdout}\`\`\`
            `);
        });
    }
};
