const { Command } = require('discord.js-commando');

module.exports = class EmojiInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'emoji-info',
            aliases: ['emoji', 'emote', 'emote-info'],
            group: 'info',
            memberName: 'emoji-info',
            description: 'Get informantion on an emoji.',
            details: 'Get detailed information on the specified emoji. Both global and custom emojis will work.',
            guildOnly: false,
            args: [{
                key: 'emoji',
                prompt: 'what emoji would you like to have information on?\n',
                type: 'emoji'
            }]
        });
    }

    async run(msg, { emoji }) {
        const info = {};
        if (emoji.id) {
            if (!emoji.id) info.server = this.client.translate('commands.emoji.unknown');
            info.server = `${emoji.guild.name} (${emoji.guild.id})`;
            info.url = this.client.translate('commands.emoji.unknown', emoji.id);
            info.name = emoji.name;
            info.id = emoji.id;
        } else {
            info.emoji = `${String.fromCodePoint(emoji.codePointAt(0))}\`${emoji}\``;
            info.codePoint = emoji.codePointAt(0);
            info.hex = info.codePoint.toString(16);
            info.usage = `\`\\u{${info.hex}}\``;
        }
        let out = this.client.translate('commands.emoji.information');
        for (let key in info) {
            if (key !== 'url') out += `**${this.client.utils.toTitleCase(key)}**: ${info[key]}\n`;
        }
        return msg.embed({
            color: 3447003,
            description: out,
            image: { url: info.url ? info.url : null }
        });
    }
};
