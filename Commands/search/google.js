const { Command } = require('discord.js-commando');
const request = require('snekfetch');

const { googleAPI, googleSearchID } = require('../../Config');
const { stripIndents } = require('common-tags');

module.exports = class GoogleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'google',
            aliases: ['google-search', 'search-google'],
            group: 'search',
            memberName: 'google',
            description: 'Searches Google for your query.',
            throttling: {
                usages: 3,
                duration: 5
            },
            args: [{
                key: 'query',
                prompt: 'What would you like to search for?',
                type: 'string',
                validate: query => {
                    if (encodeURIComponent(query).length < 1950) return true;
                    return 'Invalid query, your query is too long.';
                }
            }]
        });
    }

    async run(msg, { query }) {
        try {
            const { body } = await request
                .get('https://www.googleapis.com/customsearch/v1')
                .query({
                    key: googleAPI,
                    cx: googleSearchID,
                    q: query
                });
            if (!body.items) return msg.say('Could not find any results.');
            return msg.say(stripIndents`
                **${body.items[0].title}**

                ${body.items[0].snippet}

                🔗 **${body.items[0].formattedUrl}**
            `);
        } catch (err) {
            return msg.say(`http://lmgtfy.com/?iie=1&q=${encodeURIComponent(query)}`);
        }
    }
};
