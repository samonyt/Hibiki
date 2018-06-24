const { Command } = require('discord.js-commando');
const Random = require('random-js');

const { big } = require('../../assets/json/lund');

const { MessageEmbed } = require('discord.js');

module.exports = class Dick extends Command {
    constructor(client) {
        super(client, {
            name: 'dick',
            aliases: ['penis', 'lund'],
            group: 'analyze',
            memberName: 'dick',
            description: 'What\'s your dick size? 🤔',
            args: [{
                key: 'user',
                prompt: 'What user do you want to determine the dick size of?',
                type: 'user',
                default: msg => msg.author
            }]
        });
    }

    async run(msg, { user }) {
        const embed = new MessageEmbed();
        if (!big[user.id]) {
            if (user == this.client.user) await embed.setDescription(this.client.translate('commands.dick.bot'));
            const random = new Random(Random.engines.mt19937().seed(user.id));
            await embed.setColor(this.client.color);
            await embed.setDescription(this.client.translate('commands.dick.response', user, `${'='.repeat(random.integer(0, 200))}D`));
            await embed.setFooter(this.client.version);
        } else {
            await embed.setColor(this.client.color);
            await embed.setDescription(this.client.translate('commands.dick.response', user, big[user.id]));
            await embed.setFooter(this.client.version);
        }
        return msg.embed(embed);
    }
};
 