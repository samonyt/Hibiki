const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Quote extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            group: 'util',
            memberName: 'quote',
            description: 'Quotes a message ID.',
            guildOnly: true,
            examples: ['quote <message id here>'],
            args: [{
                key: 'quote',
                prompt: 'Which message ID do you want to quote?\n',
                type: 'message'
            }]
        });
    }
    run(msg, { quote }) {
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setAuthor(`${quote.author.tag}`, quote.author.displayAvatarURL())
            .setDescription(quote.content)
            .setFooter(`ID: ${quote.id} | ${quote.createdAt.toLocaleString()} | ${this.client.version}`);
        msg.embed(embed);
    }
};