const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { full, none } = require('../../Assets/json/gay');

module.exports = class Gay extends Command {
    constructor(client) {
        super(client, {
            name: 'gay',
            group: 'analyze',
            memberName: 'gay',
            description: 'Check user\'s gayness.',
            examples: ['gay @User#1234'],
            guildOnly: true,
            args: [{
                key: 'user',
                prompt: 'Which user do you want to check?\n',
                type: 'user'
            }]
        });
    }
    async run (msg, { user } ) {
        let gayPercent;
        const embed = new MessageEmbed();

        if (user.id === this.client.user.id) {
            await embed.setColor(this.client.color);
            await embed.setDescription('I\'m underage. Pervert!');
            await embed.setFooter(this.client.version);
        }

        if (none.includes(user.id)) gayPercent = 0;
        else if (full.includes(user.id)) gayPercent = 1e8;
        else gayPercent = gayPercent = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

        if (gayPercent > 50) {
            await embed.setColor(this.client.color);
            await embed.setDescription(`:gay_pride_flag: **${user.username}** is **${gayPercent}**% gay!`);
            await embed.setFooter(this.client.version);
        } else {
            await embed.setColor(this.client.color);
            await embed.setDescription(`🌈 **${user.username}** is **${gayPercent}**% gay!`);
            await embed.setFooter(this.client.version);
        }

        return msg.embed(embed);
    }
};
