const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');

module.exports = class Pat extends Command {
    constructor(client) {
        super(client, {
            name: 'pat',
            group: 'roleplay',
            memberName: 'pat',
            description: 'Pat whoever you want.~ :3',
            examples: ['pat @User#1234'],
            args: [{
                key: 'user',
                prompt: 'Which user do you want to pat?~\n',
                type: 'user'
            }]
        });
    }
    async run(msg, { user }) {
        const { body } = await get('https://rra.ram.moe/i/r?type=pat');
        if (user == this.client.user) {
            return msg.say('*pats you back*~ ❤', { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
        }
        if (user == msg.author) {
            return msg.say(`I-I'm sorry you're lonely ${user}. *pats*~ ❤`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
        }
        return msg.say(`*${msg.author.toString()} pats ${user}*~ ❤`, { files: [{ attachment: `https://rra.ram.moe/${body.path}`, name: `${body.path}` }] });
    }
};
