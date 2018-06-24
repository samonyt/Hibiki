const { Command } = require('discord.js-commando');

module.exports = class WelcomeMessage extends Command {
    constructor(client) {
        super(client, {
            name: 'welcome-msg',
            aliases: ['welcome-message', 'member-msg'],
            group: 'settings',
            memberName: 'welcome-msg',
            description: 'Sets a welcome/bye message(s) for new users.',
            details: 'Placeholders:\n<user>: Username, <server>: Guild name, <mention>: User mention.',
            guildOnly: true,
            args: [{
                key: 'type',
                prompt: 'Which message would you like to change? Please enter either `welcomeMsg` or `byeMsg`.\n',
                type: 'string',
                validate: (type) => {
                    if (['welcomeMsg', 'byeMsg'].includes(type)) return true;
                    else return 'Please type either `welcomeMsg` or `byeMsg`.\n';
                }
            }, {
                key: 'message',
                prompt: 'What should be sent to the channel? Use <user> (username), <server> (server name), and <mention> (user mention) as placeholders.\n',
                type: 'string',
                validate: (message) => {
                    if (message.length < 150) return true;
                    else return 'Invalid welcome message. Message must be under 150 characters.\n';
                }
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.permissions.has('MANAGE_SERVER');
    }

    run(msg, args) {
        const { type, message } = args;
        if (type === 'welcomeMsg') {
            msg.guild.settings.set('welcomeMsg', message);
            return msg.say(`✅ | Succesfully set welcome message to \`"${message}"\` in this server.`);
        } else {
            msg.guild.settings.set('byeMsg', message);
            return msg.say(`✅ | Succesfully set farewell message to \`"${message}"\` in this server.`);
        }
    }
};
