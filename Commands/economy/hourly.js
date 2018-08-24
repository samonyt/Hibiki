const { Command } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');
const { stripIndents } = require('common-tags');

const Currency = require('../../Structures/Currency');
const Hourly = require('../../Structures/Hourly');

module.exports = class HourlyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hourly',
            group: 'economy',
            memberName: 'hourly',
            description: `Receive or gift your hourly ${Currency.textPlural}.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'member',
                    prompt: 'whom do you want to give your hourly?\n',
                    type: 'member',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        const member = args.member || msg.member;
        const received = await Hourly.received(msg.author.id);
        if (received) {
            const nextHourly = await Hourly.nextHourly(msg.author.id);
            return msg.reply(stripIndents`
				you have already received your hourly ${Currency.textPlural}.
				You can receive your next hourly in ${moment.duration(nextHourly).format('hh [hours] mm [minutes]')}
			`);
        }

        if (member.id !== msg.author.id) {
            Hourly.receive(msg.author.id, member.id);
            return msg.reply(
                `${member} has successfully received your hourly ${Currency.convert(Hourly.hourlyDonationPayout)}.`
            );
        }

        Hourly.receive(msg.author.id);

        return msg.reply(`You have successfully received your hourly ${Currency.convert(Hourly.hourlyPayout)}.`);
    }
};
