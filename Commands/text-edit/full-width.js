const { Command } = require('discord.js-commando');
const fw = 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ　ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９／－＋～！＠＃＄％＾＆＊（）＿＋、。';
const hw = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-+~!@#$%^&*()_+,.';

module.exports = class FullWidth extends Command {
    constructor(client) {
        super(client, {
            name: 'full-width',
            group: 'text-edit',
            aliases: ['fullwidth'],
            description: 'Convert half-width latin to full-width.',
            memberName: 'full-width',
            args: [{
                key: 'text',
                prompt: 'What do you want to convert to?',
                type: 'string'
            }]
        });
    }
    run(msg, { text }) {
        const input = text.split('');
        const output = input.map(letter => hw.indexOf(letter) > -1 ? fw[hw.indexOf(letter)] : letter).join('');
        return msg.say(output);
    }
};