const escapeRegex = require('escape-string-regexp');
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../config');
const winston = require('winston');

module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            aliases: ['ev', 'evaluate', 'js'],
            group: 'owner',
            memberName: 'eval',
            ownerOnly: true,
            description: 'Evaluates asynchronous JavaScript code.',
            details: 'Only the bot owner may use this command.',
            examples: ['eval <code>'],
            args: [{
                key: 'script',
                prompt: 'What code would you like to evaluate?\n',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        try {
            let evaled;
            evaled = eval(`(async()=>{${args.script}})();`);
            if (evaled instanceof Promise) {
                if (msg.cmd === 'eval') await evaled;
                else evaled = await evaled;
            }
            let responseTypeOf;
            if (typeof evaled !== 'string') {
                responseTypeOf = require('util').inspect(evaled, { depth: 0 });
            } else responseTypeOf = evaled;
            let data = `${responseTypeOf.replace(new RegExp(`
                ${this.client.token}|${config.keys.token}|${config.keys.osu}|${config.keys.cat}|${config.keys.yandex}|${config.keys.apixu}|${config.keys.encrypt}|${config.keys.fortnite}|${config.keys.genius}|${config.keys.webhook.id}|${config.keys.webhook.token}
            `, 'g'), '「ｒｅｄａｃｔｅｄ」')}`;
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setFooter(`v${this.client.version}`)
                .addField('Output', `\`\`\`js\n${data}\`\`\``, true);
            await msg.embed(embed);
        } catch (err) {
            const embed = new MessageEmbed()
                .setColor(0xFF0000)
                .setFooter(`v${this.client.version}`)
                .addField('Error', `\`\`\`js\n${err.message}\`\`\``, true);
            await msg.embed(embed)
                .catch(err => winston.error(err.stack));
        }
    }
    get sensitivePattern() {
        if(!this._sensitivePattern) {
            const client = this.client;
            let pattern = '';
            if(client.token) pattern += escapeRegex(client.token);
            Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
        }
        return this._sensitivePattern;
    }
};