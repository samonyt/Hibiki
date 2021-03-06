const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { get } = require('snekfetch');
const Raven = require('raven');

module.exports = class MDN extends Command {
    constructor(client) {
        super(client, {
            name: 'mdn',
            aliases: ['mozilla-developer-network'],
            group: 'search',
            memberName: 'mdn',
            description: 'Searches MDN for your query.',
            args: [{
                key: 'query',
                prompt: 'What article would you like to search for?',
                type: 'string',
                parse: query => query.replace(/#/g, '.prototype.')
            }]
        });
    }

    async run(msg, { query }) {
        try {
            const { body } = await get('https://developer.mozilla.org/en-US/search.json')
                .query({
                    q: query,
                    locale: 'en-US',
                    highlight: false
                });
            if (!body.documents.length) return msg.say('No results.');
            const data = body.documents[0];
            const embed = new MessageEmbed()
                .setColor(0x066FAD)
                .setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
                .setURL(data.url)
                .setTitle(data.title)
                .setDescription(data.excerpt);
            return msg.embed(embed);
        } catch (err) {
            Raven.captureException(err);
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};