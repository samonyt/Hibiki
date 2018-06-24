const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { get } = require('snekfetch');

module.exports = class NPM extends Command {
    constructor(client) {
        super(client, {
            name: 'npm',
            aliases: ['npm-package'],
            group: 'info',
            memberName: 'npm',
            description: 'Searches information about an NPM package.',
            examples: ['npm <npm package name here>'],
            args: [{
                key: 'pkg',
                label: 'package',
                prompt: 'What NPM package would you like to get the information on?\n',
                type: 'string',
                parse: pkg => encodeURIComponent(pkg.replace(/ /g, '-'))
            }]
        });
    }

    async run(msg, { pkg }) {
        const { trimArray } = this.client.modules.Util;
        try {
            const { body } = await get(`https://registry.npmjs.com/${pkg}`);
            if (body.time.unpublished) return msg.say(this.client.translate('commands.npm.404'));
            const version = body.versions[body['dist-tags'].latest];
            const maintainers = trimArray(body.maintainers.map(user => user.name));
            const dependencies = version.dependencies ? trimArray(Object.keys(version.dependencies)) : null;
            const author = this.client.translate('commands.npm.embeds.author');
            const embed = new MessageEmbed()
                .setColor(0xCB0000)
                .setAuthor(author[0], author[1], author[2])
                .setTitle(body.name)
                .setURL(`https://www.npmjs.com/package/${pkg}`)
                .setDescription(body.description || this.client.translate('commands.npm.noDesc'))
                .addField(this.client.translate('commands.npm.version'), body['dist-tags'].latest, true)
                .addField(this.client.translate('commands.npm.license'), body.license || this.client.translate('commands.n/A'), true)
                .addField(this.client.translate('commands.npm.author'), body.author ? body.author.name : this.client.translate('commands.n/A'), true)
                .addField(this.client.translate('commands.npm.createDate'), new Date(body.time.created).toDateString(), true)
                .addField(this.client.translate('commands.npm.modifDate'), new Date(body.time.modified).toDateString(), true)
                .addField(this.client.translate('commands.npm.mainFile')[0], version.main || this.client.translate('commands.npm.mainFile')[1], true)
                .addField(this.client.translate('commands.npm.deps'), dependencies && dependencies.length ? dependencies.join(', ') : 'N/A')
                .addField(this.client.translate('commands.npm.maintainers'), maintainers.join(', '));
            return msg.embed(embed);
        } catch (err) {
            if (err.status === 404) return msg.say(this.client.translate('commands.npm.404'));
            return msg.say(this.client.translate('commands.error'), err.message);
        }
    }
};
