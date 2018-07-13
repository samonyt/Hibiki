const { color } = require('../Config');
const { MessageEmbed } = require('discord.js');

const timestampToDate = timestamp => {
    if (timestamp === true) {
        return new Date();
    }
    if (typeof timestamp === 'number') {
        return new Date(timestamp);
    }
    return timestamp;
};

const randomFooter = () => {
    let footers = ([
        'Nadeshiko is the best bot',
        'Chifu is my daddy',
        'Eat, Sleep, Code',
        'Just add water!',
        'Code is love, Code is life'
    ]);
    return footers[Math.floor(Math.random() * footers.length)];
};

module.exports = (title, description = '', fields = [], options = {}) => {
    let url = options.url || '';
    let colors = options.color || color;

    if (options.inline) {
        if (fields.length % 3 === 2) {
            fields.push({ name: '\u200b', value: '\u200b' });
        }
        fields.forEach(obj => {
            obj.inline = true;
        });
    }

    return new MessageEmbed({ fields, video: options.video || url })
        .setTitle(title)
        .setColor(colors)
        .setDescription(description)
        .setURL(url)
        .setImage(options.image)
        .setTimestamp(options.timestamp ? timestampToDate(options.timestamp) : null)
        .setFooter(options.footer === true ? randomFooter() : (options.footer ? options.footer : ''), options.footer ? this.user.avatarURL : undefined)
        .setAuthor(options.author === undefined ? '' : options.author)
        .setThumbnail(options.thumbnail);
};