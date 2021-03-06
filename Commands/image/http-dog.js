const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
const Raven = require('raven');

module.exports = class HTTPDog extends Command {
    constructor(client) {
        super(client, {
            name: 'http-dog',
            aliases: ['hd'],
            group: 'image',
            memberName: 'http-dog',
            description: 'Responds with a HTTP dog based on the code you wrote.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'code',
                prompt: 'WhatX is the code?\n',
                type: 'integer'
            }]
        });
    }

    async run(msg, { code }) {
        try {
            const { body, headers } = await get(`https://httpstatusdogs.com/img/${code}.png`);
            if (headers['content-type'].includes('text/html')) return msg.say('I didn\'t found any results. Try again later.');
            return msg.say({ files: [{ attachment: body, name: 'code.png' }] });
        } catch (err) {
            Raven.captureException(err);
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};