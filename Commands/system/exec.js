const { Command } = require('discord.js-commando');
const { exec } = require('child_process');
const { stripIndents } = require('common-tags');

module.exports = class Exec extends Command {
    constructor(client) {
        super(client, {
            name: 'exec',
            aliases: ['execute'],
            group: 'system',
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

    async run(msg, { code }) {
        exec(code, (err, stdout) => {
            if (err) {
                return msg.say(`\`\`\`${stripIndents`
                    $ ${code} 
                    
                    ${err.message}
                    \`\`\`
                `}`);
            }
            return msg.say(`\`\`\`${stripIndents`
                    $ ${code} 
            
                    ${stdout ? stdout : 'Command ran with an empty response.'}
                    \`\`\`
            `}`);
        });
    }
};
